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

export interface SchemaDiff {
  missingFromTs: string[]
  missingFromSwagger: string[]
  typeMismatches: TypeMismatch[]
  requiredMismatches: RequiredMismatch[]
  enumMismatches: EnumMismatch[]
}

export function createTypeSchema(typeName: string, filePath: string): Schema {
  const schema = createGenerator({
    path: filePath,
    tsconfig: path.resolve(__dirname, "../../../tsconfig.json"),
    type: typeName,
    topRef: false,
    skipTypeCheck: true,
  }).createSchema(typeName)
  return schema as Schema
}

export function compareSchemas(
  tsSchema: Schema,
  swaggerSchema: Schema,
  swaggerDefinitions: Schema,
): SchemaDiff {
  const swaggerFlat = resolveToObjectSchema(swaggerSchema, swaggerDefinitions)

  const ctx: DiffContext = {
    tsDefs: tsSchema.definitions ?? {},
    swaggerDefs: swaggerDefinitions,
    diff: {
      missingFromTs: [],
      missingFromSwagger: [],
      typeMismatches: [],
      requiredMismatches: [],
      enumMismatches: [],
    },
  }

  collectDiffs(tsSchema, swaggerFlat, "", ctx)
  return ctx.diff
}

export function assertTypeMatchesSwagger(tsType: string, tsFile: string, swaggerDefName: string, spec: Schema): void {
  const tsSchema = createTypeSchema(tsType, tsFile)
  const swaggerDef = spec.definitions?.[swaggerDefName]
  expect(swaggerDef, `${swaggerDefName} not found in swagger definitions`).to.exist
  const diff = compareSchemas(tsSchema, swaggerDef, spec.definitions ?? {})
  if (!isDiffEmpty(diff)) {
    expect.fail(`${tsType} does not match swagger ${swaggerDefName}:\n${formatSchemaDiff(diff)}`)
  }
}

export function isDiffEmpty(diff: SchemaDiff): boolean {
  return diff.missingFromTs.length === 0
    && diff.missingFromSwagger.length === 0
    && diff.typeMismatches.length === 0
    && diff.requiredMismatches.length === 0
    && diff.enumMismatches.length === 0
}

export function formatSchemaDiff(diff: SchemaDiff): string {
  const lines = [
    ...formatSection(
      "Fields in swagger but missing from TypeScript type:",
      diff.missingFromTs,
    ),
    ...formatSection(
      "Fields in TypeScript type but missing from swagger:",
      diff.missingFromSwagger,
    ),
    ...formatSection(
      "Type mismatches:",
      diff.typeMismatches.map(
        (m) =>
          `${m.field}: TS has "${m.tsType}", swagger has "${m.swaggerType}"`,
      ),
    ),
    ...formatSection(
      "Required/optional mismatches:",
      diff.requiredMismatches.map(
        (m) =>
          `${m.field}: TS has ${m.tsRequired ? "required" : "optional"}, swagger has ${m.swaggerRequired ? "required" : "optional"}`,
      ),
    ),
    ...formatSection(
      "Enum mismatches:",
      diff.enumMismatches.map(formatEnumMismatch),
    ),
  ]
  return lines.join("\n")
}

// --- internal helpers ---

function formatSection(title: string, items: string[]): string[] {
  if (!items.length) return []
  return [title, ...items.map((i) => `  - ${i}`)]
}

function formatEnumMismatch(m: EnumMismatch): string {
  const parts = [`${m.field}:`]
  if (m.missingFromTs.length)
    parts.push(`TS missing [${m.missingFromTs.join(", ")}]`)
  if (m.missingFromSwagger.length)
    parts.push(`swagger missing [${m.missingFromSwagger.join(", ")}]`)
  return parts.join(" ")
}

function resolveRef(ref: string, definitions: Schema): Schema {
  return definitions[ref.replace("#/definitions/", "")] ?? {}
}

function resolveToObjectSchema(schema: Schema, definitions: Schema): Schema {
  if (schema.$ref)
    return resolveToObjectSchema(
      resolveRef(schema.$ref, definitions),
      definitions,
    )
  if (schema.type === "array" && schema.items)
    return resolveToObjectSchema(schema.items, definitions)
  if (schema.allOf) return flattenAllOf(schema, definitions)
  return schema
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

function normaliseType(prop: Schema, definitions: Schema): string {
  if (prop.$ref) {
    const resolved = resolveRef(prop.$ref, definitions)
    return resolved.type ?? "object"
  }
  if (prop.type === "integer") return "number"
  if (Array.isArray(prop.type)) {
    const types = prop.type.filter((t: string) => t !== "null")
    return types.length === 1 ? types[0] : types.join(" | ")
  }
  return prop.type ?? "unknown"
}

function resolveProp(prop: Schema, definitions: Schema): Schema {
  if (prop.$ref) return resolveRef(prop.$ref, definitions)
  return resolveToObjectSchema(prop, definitions)
}

interface DiffContext {
  tsDefs: Schema
  swaggerDefs: Schema
  diff: SchemaDiff
}

function isObjectType(schema: Schema): boolean {
  return schema.type === "object" || Boolean(schema.properties)
}

function checkTypeMismatch(fullName: string, tsProp: Schema, swaggerProp: Schema, ctx: DiffContext): void {
  const tsType = normaliseType(tsProp, ctx.tsDefs)
  const swaggerType = normaliseType(swaggerProp, ctx.swaggerDefs)
  if (tsType !== swaggerType) {
    ctx.diff.typeMismatches.push({field: fullName, tsType, swaggerType})
  }
}

function checkRequiredMismatch(fullName: string, tsRequired: boolean, swaggerRequired: boolean, ctx: DiffContext): void {
  if (tsRequired !== swaggerRequired) {
    ctx.diff.requiredMismatches.push({field: fullName, tsRequired, swaggerRequired})
  }
}

function checkEnumMismatch(fullName: string, tsResolved: Schema, swaggerResolved: Schema, ctx: DiffContext): void {
  const tsEnum = new Set<string>((tsResolved.enum ?? []).map(String))
  const swaggerEnum = new Set<string>((swaggerResolved.enum ?? []).map(String))
  if (tsEnum.size === 0 && swaggerEnum.size === 0) return

  const missingFromTs = [...swaggerEnum].filter((v) => !tsEnum.has(v))
  const missingFromSwagger = [...tsEnum].filter((v) => !swaggerEnum.has(v))
  if (missingFromTs.length || missingFromSwagger.length) {
    ctx.diff.enumMismatches.push({field: fullName, missingFromTs, missingFromSwagger})
  }
}

interface FieldPair {
  field: string
  fullName: string
  tsProp: Schema
  swaggerProp: Schema
  tsRequired: boolean
  swaggerRequired: boolean
}

function compareField(pair: FieldPair, ctx: DiffContext): void {
  checkTypeMismatch(pair.fullName, pair.tsProp, pair.swaggerProp, ctx)
  checkRequiredMismatch(pair.fullName, pair.tsRequired, pair.swaggerRequired, ctx)

  const tsResolved = resolveProp(pair.tsProp, ctx.tsDefs)
  const swaggerResolved = resolveProp(pair.swaggerProp, ctx.swaggerDefs)

  checkEnumMismatch(pair.fullName, tsResolved, swaggerResolved, ctx)

  if (isObjectType(tsResolved) && isObjectType(swaggerResolved)) {
    collectDiffs(tsResolved, swaggerResolved, pair.fullName, ctx)
  }
}

function collectDiffs(tsSchema: Schema, swaggerSchema: Schema, prefix: string, ctx: DiffContext): void {
  const tsProps = tsSchema.properties ?? {}
  const swaggerProps = swaggerSchema.properties ?? {}
  const tsReq = new Set<string>(tsSchema.required ?? [])
  const swaggerReq = new Set<string>(swaggerSchema.required ?? [])
  const allFields = new Set([...Object.keys(tsProps), ...Object.keys(swaggerProps)])

  for (const field of allFields) {
    const fullName = prefix ? `${prefix}.${field}` : field

    if (!(field in tsProps)) {
      ctx.diff.missingFromTs.push(fullName)
      continue
    }
    if (!(field in swaggerProps)) {
      ctx.diff.missingFromSwagger.push(fullName)
      continue
    }

    compareField({
      field, fullName,
      tsProp: tsProps[field],
      swaggerProp: swaggerProps[field],
      tsRequired: tsReq.has(field),
      swaggerRequired: swaggerReq.has(field),
    }, ctx)
  }
}
