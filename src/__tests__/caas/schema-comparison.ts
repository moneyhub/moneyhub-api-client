/* eslint-disable max-statements */
import path from "path"
import {expect} from "chai"
import {createGenerator} from "ts-json-schema-generator"

type Schema = Record<string, any>

interface TypeMismatch {
  field: string
  tsType: string
  swaggerType: string
}

interface RequiredMismatch {
  field: string
  tsRequired: boolean
  swaggerRequired: boolean
}

interface EnumMismatch {
  field: string
  missingFromTs: string[]
  missingFromSwagger: string[]
}

interface SchemaDiff {
  missingFromTs: string[]
  missingFromSwagger: string[]
  typeMismatches: TypeMismatch[]
  requiredMismatches: RequiredMismatch[]
  enumMismatches: EnumMismatch[]
}

interface DiffArgs {
  tsDefs: Schema
  swaggerDefs: Schema
  result: SchemaDiff
}

interface FieldDiffInput {
  fieldPath: string
  tsProp: Schema
  swaggerProp: Schema
  tsRequired: boolean
  swaggerRequired: boolean
}

// -- Resolving $ref, allOf and array wrappers in swagger schemas -- //

function resolveRef(ref: string, definitions: Schema): Schema {
  return definitions[ref.replace("#/definitions/", "")] ?? {}
}

function flattenAllOf(schema: Schema, definitions: Schema): Schema {
  if (!schema.allOf) return schema

  const merged: Schema = {type: "object", properties: {}, required: []}

  for (const part of schema.allOf) {
    const resolved = part.$ref ? resolveRef(part.$ref, definitions) : part
    const flattened = resolved.allOf
      ? flattenAllOf(resolved, definitions)
      : resolved
    if (flattened.properties)
      Object.assign(merged.properties, flattened.properties)
    if (flattened.required) merged.required.push(...flattened.required)
  }

  if (schema.properties) Object.assign(merged.properties, schema.properties)
  if (schema.required) merged.required.push(...schema.required)
  merged.required = [...new Set(merged.required)]
  if (merged.required.length === 0) delete merged.required
  return merged
}

// Recursively unwraps $ref, array items, and allOf until we have a plain object schema.
function resolveToObject(schema: Schema, definitions: Schema): Schema {
  if (schema.$ref) return resolveToObject(resolveRef(schema.$ref, definitions), definitions)
  if (schema.type === "array" && schema.items) return resolveToObject(schema.items, definitions)
  if (schema.allOf) return flattenAllOf(schema, definitions)
  return schema
}

// -- Comparing TS-generated and swagger schemas field by field -- //

// Used for both TS and swagger schemas — both produce JSON Schema with the same
// type conventions ($ref, "integer", nullable arrays), so one function handles both.
function normaliseType(prop: Schema, definitions: Schema): string {
  if (prop.$ref) return resolveRef(prop.$ref, definitions).type ?? "object"
  if (prop.type === "integer") return "number"
  if (Array.isArray(prop.type)) {
    const types = prop.type.filter((t: string) => t !== "null")
    return types.length === 1 ? types[0] : types.join(" | ")
  }
  return prop.type ?? "unknown"
}

function resolveProp(prop: Schema, definitions: Schema): Schema {
  if (prop.$ref) return resolveRef(prop.$ref, definitions)
  return resolveToObject(prop, definitions)
}

function isObject(schema: Schema): boolean {
  return schema.type === "object" || Boolean(schema.properties)
}

function toEnumSet(schema: Schema): Set<string> {
  return new Set<string>((schema.enum ?? []).map(String))
}

// Compares a single field's type, required status, enum values, and recurses into nested objects.
function diffSingleField(input: FieldDiffInput, args: DiffArgs): void {
  const {fieldPath, tsProp, swaggerProp, tsRequired, swaggerRequired} = input
  const {tsDefs, swaggerDefs, result} = args

  const tsType = normaliseType(tsProp, tsDefs)
  const swaggerType = normaliseType(swaggerProp, swaggerDefs)
  if (tsType !== swaggerType) {
    result.typeMismatches.push({field: fieldPath, tsType, swaggerType})
  }

  if (tsRequired !== swaggerRequired) {
    result.requiredMismatches.push({field: fieldPath, tsRequired, swaggerRequired})
  }

  const tsResolved = resolveProp(tsProp, tsDefs)
  const swaggerResolved = resolveProp(swaggerProp, swaggerDefs)

  const tsEnums = toEnumSet(tsResolved)
  const swaggerEnums = toEnumSet(swaggerResolved)
  if (tsEnums.size > 0 || swaggerEnums.size > 0) {
    const missingFromTs = [...swaggerEnums].filter((v) => !tsEnums.has(v))
    const missingFromSwagger = [...tsEnums].filter((v) => !swaggerEnums.has(v))
    if (missingFromTs.length || missingFromSwagger.length) {
      result.enumMismatches.push({field: fieldPath, missingFromTs, missingFromSwagger})
    }
  }

  if (isObject(tsResolved) && isObject(swaggerResolved)) {
    diffFields(tsResolved, swaggerResolved, fieldPath, args) // eslint-disable-line no-use-before-define
  }
}

// Iterates all fields across both schemas, recording missing fields and delegating
// matching fields to diffSingleField for detailed comparison.
function diffFields(tsSchema: Schema, swaggerSchema: Schema, prefix: string, args: DiffArgs): void {
  const tsProps = tsSchema.properties ?? {}
  const swaggerProps = swaggerSchema.properties ?? {}
  const tsRequired = new Set<string>(tsSchema.required ?? [])
  const swaggerRequired = new Set<string>(swaggerSchema.required ?? [])

  const allFields = new Set([
    ...Object.keys(tsProps),
    ...Object.keys(swaggerProps),
  ])

  for (const field of allFields) {
    const fieldPath = prefix ? `${prefix}.${field}` : field

    if (!(field in tsProps)) {
      args.result.missingFromTs.push(fieldPath)
      continue
    }
    if (!(field in swaggerProps)) {
      args.result.missingFromSwagger.push(fieldPath)
      continue
    }

    diffSingleField({
      fieldPath,
      tsProp: tsProps[field],
      swaggerProp: swaggerProps[field],
      tsRequired: tsRequired.has(field),
      swaggerRequired: swaggerRequired.has(field),
    }, args)
  }
}

// -- Diff formatting -- //

function formatSection(title: string, items: string[]): string[] {
  if (!items.length) return []
  return [title, ...items.map((i) => `  - ${i}`)]
}

function formatSchemaDiff(diff: SchemaDiff): string {
  const lines = [
    ...formatSection("Fields in swagger but missing from TypeScript type:", diff.missingFromTs),
    ...formatSection("Fields in TypeScript type but missing from swagger:", diff.missingFromSwagger),
    ...formatSection("Type mismatches:",
      diff.typeMismatches.map((m) => `${m.field}: TS has "${m.tsType}", swagger has "${m.swaggerType}"`)),
    ...formatSection("Required/optional mismatches:",
      diff.requiredMismatches.map((m) =>
        `${m.field}: TS has ${m.tsRequired ? "required" : "optional"}, swagger has ${m.swaggerRequired ? "required" : "optional"}`)),
    ...formatSection("Enum mismatches:",
      diff.enumMismatches.map((m) => {
        const parts = [`${m.field}:`]
        if (m.missingFromTs.length) parts.push(`TS missing [${m.missingFromTs.join(", ")}]`)
        if (m.missingFromSwagger.length) parts.push(`swagger missing [${m.missingFromSwagger.join(", ")}]`)
        return parts.join(" ")
      })),
  ]
  return lines.join("\n")
}

function isDiffEmpty(diff: SchemaDiff): boolean {
  return diff.missingFromTs.length === 0
    && diff.missingFromSwagger.length === 0
    && diff.typeMismatches.length === 0
    && diff.requiredMismatches.length === 0
    && diff.enumMismatches.length === 0
}

// -- TS type schema generation and comparison -- //

function createTypeSchema(typeName: string, filePath: string): Schema {
  return createGenerator({
    path: filePath,
    tsconfig: path.resolve(__dirname, "../../../tsconfig.json"),
    type: typeName,
    topRef: false,
    skipTypeCheck: true,
  }).createSchema(typeName) as Schema
}

interface CompareSchemasInput {
  tsSchema: Schema
  swaggerSchema: Schema
  swaggerDefinitions: Schema
}

function compareSchemas({tsSchema, swaggerSchema, swaggerDefinitions}: CompareSchemasInput): SchemaDiff {
  const args: DiffArgs = {
    tsDefs: tsSchema.definitions ?? {},
    swaggerDefs: swaggerDefinitions,
    result: {
      missingFromTs: [],
      missingFromSwagger: [],
      typeMismatches: [],
      requiredMismatches: [],
      enumMismatches: [],
    },
  }

  const swaggerFlat = resolveToObject(swaggerSchema, swaggerDefinitions)
  diffFields(tsSchema, swaggerFlat, "", args)
  return args.result
}

// -- Public API --
//
// Usage:
//   assertTypeMatchesSwagger({
//     tsType: "CaasTransactionInput",
//     tsFile: "../../requests/caas/types/transactions.ts",
//     swaggerDefName: "TransactionPost",
//     spec,
//   })
//
// Generates a JSON Schema from a TypeScript type at test time, then structurally
// compares it against a swagger definition — checking for missing fields, type
// mismatches, required/optional differences, and enum value alignment.
// Fails the test with a human-readable diff if anything is out of sync.

interface AssertTypeInput {
  tsType: string
  tsFile: string
  swaggerDefName: string
  spec: Schema
}

export function assertTypeMatchesSwagger({tsType, tsFile, swaggerDefName, spec}: AssertTypeInput): void {
  const resolvedPath = path.resolve(__dirname, tsFile)
  const tsSchema = createTypeSchema(tsType, resolvedPath)
  const swaggerDef = spec.definitions?.[swaggerDefName]
  expect(swaggerDef, `${swaggerDefName} not found in swagger definitions`).to.exist

  const diff = compareSchemas({tsSchema, swaggerSchema: swaggerDef, swaggerDefinitions: spec.definitions ?? {}})
  if (!isDiffEmpty(diff)) {
    expect.fail(`${tsType} does not match swagger ${swaggerDefName}:\n${formatSchemaDiff(diff)}`)
  }
}
