/* eslint-disable complexity */
import {resolveRef, resolveToObject} from "./resolvers"
import type {Schema} from "./resolvers"

// -- Types -- //

interface SchemaDefinitions {
  ts: Schema
  openApi: Schema
}

interface FieldPair {
  fieldPath: string
  tsProp: Schema | undefined
  openApiProp: Schema | undefined
  tsRequired: boolean
  openApiRequired: boolean
}

type MatchedField = FieldPair & {tsProp: Schema, openApiProp: Schema}

function isMatchedField(field: FieldPair): field is MatchedField {
  return field.tsProp !== undefined && field.openApiProp !== undefined
}

// Union variants are sorted so that order in source (e.g. "null | string" vs
// "string | null") does not produce spurious mismatches during comparison.
function joinUnion(variants: string[]): string {
  return [...variants].sort().join(" | ")
}

export function normaliseType(prop: Schema, definitions: Schema): string {
  if (prop.$ref) {
    return normaliseType(resolveRef(prop.$ref, definitions), definitions)
  }

  if (prop.allOf || prop.properties) {
    return Array.isArray(prop.type) && prop.type.includes("null")
      ? joinUnion(["object", "null"])
      : "object"
  }

  // ts-json-schema-generator uses anyOf/oneOf for union types (e.g. string | null).
  // Null is preserved so nullable mismatches (e.g. TS string vs OpenAPI string | null) are caught.
  if (prop.anyOf || prop.oneOf) {
    return joinUnion(
      (prop.anyOf ?? prop.oneOf).map((v: Schema) => normaliseType(v, definitions)),
    )
  }

  if (prop.type === "integer") {
    return "number"
  }

  // OpenAPI nullable / x-nullable is preprocessed into type: ["string", "null"] before comparison.
  if (Array.isArray(prop.type)) {
    return joinUnion(prop.type.map((t: string) => (t === "integer" ? "number" : t)))
  }

  return prop.type ?? "unknown"
}

// -- Collecting field pairs -- //

interface CollectInput {
  tsProps: Schema
  openApiProps: Schema
  tsRequired: Set<string>
  openApiRequired: Set<string>
  definitions: SchemaDefinitions
  prefix?: string
  visited?: Set<string>
}

function isObject(schema: Schema): boolean {
  return schema.type === "object" || Boolean(schema.properties)
}

function buildPair(input: {
  field: string
  prefix: string
  tsProps: Schema
  openApiProps: Schema
  tsRequired: Set<string>
  openApiRequired: Set<string>
}): FieldPair {
  const fieldPath = input.prefix
    ? `${input.prefix}.${input.field}`
    : input.field

  return {
    fieldPath,
    tsProp: input.tsProps[input.field],
    openApiProp: input.openApiProps[input.field],
    tsRequired: input.tsRequired.has(input.field),
    openApiRequired: input.openApiRequired.has(input.field),
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

function refKey(pair: MatchedField): string | null {
  const tsRef = pair.tsProp.$ref
  const openApiRef = pair.openApiProp.$ref
  return tsRef || openApiRef ? `${tsRef ?? ""}|${openApiRef ?? ""}` : null
}

function nestedPairs(
  pair: MatchedField,
  definitions: SchemaDefinitions,
  visited: Set<string>,
): FieldPair[] {
  const key = refKey(pair)
  if (key !== null && visited.has(key)) return []

  const nextVisited = key !== null ? new Set([...visited, key]) : visited

  const tsResolved = resolveToObject(pair.tsProp, definitions.ts)
  const openApiResolved = resolveToObject(pair.openApiProp, definitions.openApi)

  if (!isObject(tsResolved) || !isObject(openApiResolved)) return []

  const ts = propsFromSchema(tsResolved)
  const openApi = propsFromSchema(openApiResolved)

  return collectFieldPairs({
    tsProps: ts.properties,
    openApiProps: openApi.properties,
    tsRequired: ts.required,
    openApiRequired: openApi.required,
    definitions,
    prefix: pair.fieldPath,
    visited: nextVisited,
  })
}

// FieldPairs are the main objects built for comparison. Each one pairs up a
// field from the TS schema with the same field from the OpenAPI schema.
//
// For nested objects, fieldPath uses dot-separated notation built up through
// recursion. Given an OpenAPI schema like:
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
    openApiProps,
    tsRequired,
    openApiRequired,
    definitions,
    prefix = "",
    visited = new Set<string>(),
  } = input
  const allFields = [
    ...new Set([...Object.keys(tsProps), ...Object.keys(openApiProps)]),
  ]

  const pairs = allFields.map((field) =>
    buildPair({
      field,
      prefix,
      tsProps,
      openApiProps,
      tsRequired,
      openApiRequired,
    }),
  )

  const nested = pairs
    .filter(isMatchedField)
    .flatMap((pair) => nestedPairs(pair, definitions, visited))

  return [...pairs, ...nested]
}

// -- Error formatting -- //

function missingFieldError(fieldPath: string): string {
  return `${fieldPath}: missing from TS type, expected by OpenAPI`
}

function extraFieldError(fieldPath: string): string {
  return `${fieldPath}: exists in TS type but not defined in OpenAPI`
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

// Null is stripped because nullability is already reported by checkTypes.
// Without this, OpenAPI enums with nullable: true would include "null" as a
// literal enum value and produce false-positive mismatches.
function toEnumSet(schema: Schema): Set<string> {
  return new Set<string>(
    (schema.enum ?? [])
      .filter((value: unknown) => value !== null)
      .map(String),
  )
}

function checkMissingFields(fields: FieldPair[]): string[] {
  return fields
    .filter((field) => !field.tsProp)
    .map((field) => missingFieldError(field.fieldPath))
}

function checkExtraFields(fields: FieldPair[]): string[] {
  return fields
    .filter((field) => !field.openApiProp)
    .map((field) => extraFieldError(field.fieldPath))
}

function checkTypes(
  fields: MatchedField[],
  definitions: SchemaDefinitions,
): string[] {
  return fields
    .map(({fieldPath, tsProp, openApiProp}) => ({
      fieldPath,
      actual: normaliseType(tsProp, definitions.ts),
      expected: normaliseType(openApiProp, definitions.openApi),
    }))
    .filter(({actual, expected}) => actual !== expected)
    .map(({fieldPath, expected, actual}) =>
      typeMismatchError(fieldPath, expected, actual),
    )
}

function checkRequired(fields: MatchedField[]): string[] {
  return fields
    .filter(({tsRequired, openApiRequired}) => tsRequired !== openApiRequired)
    .map(({fieldPath, openApiRequired}) =>
      requiredMismatchError(
        fieldPath,
        openApiRequired ? "required" : "optional",
      ),
    )
}

function enumErrorsForField(
  fieldPath: string,
  tsEnums: Set<string>,
  openApiEnums: Set<string>,
): string[] {
  if (tsEnums.size === 0 && openApiEnums.size === 0) return []

  const missing = [...openApiEnums].filter((value) => !tsEnums.has(value))
  const extra = [...tsEnums].filter((value) => !openApiEnums.has(value))

  return [
    missing.length ? missingEnumValuesError(fieldPath, missing) : null,
    extra.length ? extraEnumValuesError(fieldPath, extra) : null,
  ].filter((error): error is string => error !== null)
}

function checkEnums(
  fields: MatchedField[],
  definitions: SchemaDefinitions,
): string[] {
  return fields.flatMap(({fieldPath, tsProp, openApiProp}) =>
    enumErrorsForField(
      fieldPath,
      toEnumSet(resolveToObject(tsProp, definitions.ts)),
      toEnumSet(resolveToObject(openApiProp, definitions.openApi)),
    ),
  )
}

// -- Orchestrator -- //

interface FindErrorsInput {
  tsSchema: Schema
  openApiSchema: Schema
  openApiDefinitions: Schema
}

export function findSchemaErrors({
  tsSchema,
  openApiSchema,
  openApiDefinitions,
}: FindErrorsInput): string[] {
  const definitions: SchemaDefinitions = {
    ts: tsSchema.definitions ?? {},
    openApi: openApiDefinitions,
  }

  const resolvedOpenApi = resolveToObject(openApiSchema, openApiDefinitions)
  const ts = propsFromSchema(tsSchema)
  const openApi = propsFromSchema(resolvedOpenApi)

  const allFields = collectFieldPairs({
    tsProps: ts.properties,
    openApiProps: openApi.properties,
    tsRequired: ts.required,
    openApiRequired: openApi.required,
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
