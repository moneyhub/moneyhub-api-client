import {resolveProp, resolveRef, resolveToObject} from "./resolvers"
import type {Schema} from "./resolvers"

// -- Types -- //

interface SchemaDefinitions {
  ts: Schema
  swagger: Schema
}

interface FieldPair {
  fieldPath: string
  tsProp: Schema | undefined
  swaggerProp: Schema | undefined
  tsRequired: boolean
  swaggerRequired: boolean
}

type MatchedField = FieldPair & {tsProp: Schema, swaggerProp: Schema}

function isMatchedField(field: FieldPair): field is MatchedField {
  return field.tsProp !== undefined && field.swaggerProp !== undefined
}

export function normaliseType(prop: Schema, definitions: Schema): string {
  if (prop.$ref) {
    return resolveRef(prop.$ref, definitions).type ?? "object"
  }

  if (prop.type === "integer") {
    return "number"
  }

  if (Array.isArray(prop.type)) {
    const nonNullTypes = prop.type.filter((type: string) => type !== "null")
    return nonNullTypes.length === 1
      ? nonNullTypes[0]
      : nonNullTypes.join(" | ")
  }

  return prop.type ?? "unknown"
}

// -- Collecting field pairs -- //

interface CollectInput {
  tsProps: Schema
  swaggerProps: Schema
  tsRequired: Set<string>
  swaggerRequired: Set<string>
  definitions: SchemaDefinitions
  prefix?: string
}

function isObject(schema: Schema): boolean {
  return schema.type === "object" || Boolean(schema.properties)
}

function buildPair(input: {
  field: string
  prefix: string
  tsProps: Schema
  swaggerProps: Schema
  tsRequired: Set<string>
  swaggerRequired: Set<string>
}): FieldPair {
  const fieldPath = input.prefix
    ? `${input.prefix}.${input.field}`
    : input.field

  return {
    fieldPath,
    tsProp: input.tsProps[input.field],
    swaggerProp: input.swaggerProps[input.field],
    tsRequired: input.tsRequired.has(input.field),
    swaggerRequired: input.swaggerRequired.has(input.field),
  }
}

function propsFromSchema(schema: Schema): {
  properties: Schema
  required: Set<string>
} {
  return {
    properties: schema.properties ?? {},
    required: new Set<string>(schema.required ?? []),
  }
}

function nestedPairs(
  pair: MatchedField,
  definitions: SchemaDefinitions,
): FieldPair[] {
  const tsResolved = resolveProp(pair.tsProp, definitions.ts)
  const swaggerResolved = resolveProp(pair.swaggerProp, definitions.swagger)

  if (!isObject(tsResolved) || !isObject(swaggerResolved)) return []

  const ts = propsFromSchema(tsResolved)
  const swagger = propsFromSchema(swaggerResolved)

  return collectFieldPairs({
    tsProps: ts.properties,
    swaggerProps: swagger.properties,
    tsRequired: ts.required,
    swaggerRequired: swagger.required,
    definitions,
    prefix: pair.fieldPath,
  })
}

// FieldPairs are the main objects built for comparison. Each one pairs up a
// field from the TS schema with the same field from the swagger schema.
//
// For nested objects, fieldPath uses dot-separated notation built up through
// recursion. Given a swagger schema like:
//
//   { properties: { mhInsights: { properties: { l2CategoryId: { type: "string" } } } } }
//
// collectFieldPairs produces pairs with fieldPaths "mhInsights" and
// "mhInsights.l2CategoryId". These are then passed to each checker, which
// produces error messages like:
//
//   mhInsights.l2CategoryId: should be type "string", got "number"
//
function collectFieldPairs(input: CollectInput): FieldPair[] {
  const {
    tsProps,
    swaggerProps,
    tsRequired,
    swaggerRequired,
    definitions,
    prefix = "",
  } = input
  const allFields = [
    ...new Set([...Object.keys(tsProps), ...Object.keys(swaggerProps)]),
  ]

  const pairs = allFields.map((field) =>
    buildPair({
      field,
      prefix,
      tsProps,
      swaggerProps,
      tsRequired,
      swaggerRequired,
    }),
  )

  const nested = pairs
    .filter(isMatchedField)
    .flatMap((pair) => nestedPairs(pair, definitions))

  return [...pairs, ...nested]
}

// -- Error formatting -- //

function missingFieldError(fieldPath: string): string {
  return `${fieldPath}: missing from TS type, expected by swagger`
}

function extraFieldError(fieldPath: string): string {
  return `${fieldPath}: exists in TS type but not defined in swagger`
}

function typeMismatchError(
  fieldPath: string,
  expected: string,
  actual: string,
): string {
  return `${fieldPath}: should be type "${expected}", got "${actual}"`
}

function requiredMismatchError(
  fieldPath: string,
  expected: "required" | "optional",
): string {
  return `${fieldPath}: should be ${expected}`
}

function missingEnumValuesError(fieldPath: string, values: string[]): string {
  return `${fieldPath}: missing enum values [${values.join(", ")}]`
}

function extraEnumValuesError(fieldPath: string, values: string[]): string {
  return `${fieldPath}: unexpected enum values [${values.join(", ")}]`
}

// -- Checks -- //

function toEnumSet(schema: Schema): Set<string> {
  return new Set<string>((schema.enum ?? []).map(String))
}

function checkMissingFields(fields: FieldPair[]): string[] {
  return fields
    .filter((field) => !field.tsProp)
    .map((field) => missingFieldError(field.fieldPath))
}

function checkExtraFields(fields: FieldPair[]): string[] {
  return fields
    .filter((field) => !field.swaggerProp)
    .map((field) => extraFieldError(field.fieldPath))
}

function checkTypes(
  fields: MatchedField[],
  definitions: SchemaDefinitions,
): string[] {
  return fields
    .map(({fieldPath, tsProp, swaggerProp}) => ({
      fieldPath,
      actual: normaliseType(tsProp, definitions.ts),
      expected: normaliseType(swaggerProp, definitions.swagger),
    }))
    .filter(({actual, expected}) => actual !== expected)
    .map(({fieldPath, expected, actual}) =>
      typeMismatchError(fieldPath, expected, actual),
    )
}

function checkRequired(fields: MatchedField[]): string[] {
  return fields
    .filter(({tsRequired, swaggerRequired}) => tsRequired !== swaggerRequired)
    .map(({fieldPath, swaggerRequired}) =>
      requiredMismatchError(
        fieldPath,
        swaggerRequired ? "required" : "optional",
      ),
    )
}

function enumErrorsForField(
  fieldPath: string,
  tsEnums: Set<string>,
  swaggerEnums: Set<string>,
): string[] {
  if (tsEnums.size === 0 && swaggerEnums.size === 0) return []

  const missing = [...swaggerEnums].filter((value) => !tsEnums.has(value))
  const extra = [...tsEnums].filter((value) => !swaggerEnums.has(value))

  return [
    missing.length ? missingEnumValuesError(fieldPath, missing) : null,
    extra.length ? extraEnumValuesError(fieldPath, extra) : null,
  ].filter((error): error is string => error !== null)
}

function checkEnums(
  fields: MatchedField[],
  definitions: SchemaDefinitions,
): string[] {
  return fields.flatMap(({fieldPath, tsProp, swaggerProp}) =>
    enumErrorsForField(
      fieldPath,
      toEnumSet(resolveProp(tsProp, definitions.ts)),
      toEnumSet(resolveProp(swaggerProp, definitions.swagger)),
    ),
  )
}

// -- Orchestrator -- //

interface FindErrorsInput {
  tsSchema: Schema
  swaggerSchema: Schema
  swaggerDefinitions: Schema
}

export function findSchemaErrors({
  tsSchema,
  swaggerSchema,
  swaggerDefinitions,
}: FindErrorsInput): string[] {
  const definitions: SchemaDefinitions = {
    ts: tsSchema.definitions,
    swagger: swaggerDefinitions,
  }

  const resolvedSwagger = resolveToObject(swaggerSchema, swaggerDefinitions)
  const ts = propsFromSchema(tsSchema)
  const swagger = propsFromSchema(resolvedSwagger)

  const allFields = collectFieldPairs({
    tsProps: ts.properties,
    swaggerProps: swagger.properties,
    tsRequired: ts.required,
    swaggerRequired: swagger.required,
    definitions,
  })

  const matchedFields = allFields.filter(isMatchedField)

  return [
    ...checkMissingFields(allFields),
    ...checkExtraFields(allFields),
    ...checkTypes(matchedFields, definitions),
    ...checkRequired(matchedFields),
    ...checkEnums(matchedFields, definitions),
  ]
}
