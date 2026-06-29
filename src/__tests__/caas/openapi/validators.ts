import Ajv from "ajv"
import type {ValidateFunction} from "ajv"
import addFormats from "ajv-formats"

type Schema = Record<string, any>

const COMPONENTS_SCHEMA_PREFIX = "#/components/schemas/"
const DEFINITIONS_PREFIX = "#/definitions/"

export function getSchemaDefinitions(spec: Schema): Schema {
  return spec.components?.schemas ?? {}
}

function normalizeComponentRefs(obj: unknown): unknown {
  if (obj == null) return obj
  if (Array.isArray(obj)) return obj.map(normalizeComponentRefs)
  if (typeof obj !== "object") return obj

  return Object.entries(obj).reduce<Schema>((acc, [key, value]) => {
    if (key === "$ref" && typeof value === "string" && value.startsWith(COMPONENTS_SCHEMA_PREFIX)) {
      acc[key] = `${DEFINITIONS_PREFIX}${value.slice(COMPONENTS_SCHEMA_PREFIX.length)}`
      return acc
    }

    acc[key] = normalizeComponentRefs(value)
    return acc
  }, {})
}

export function preprocessSchema(obj: unknown): unknown {
  if (obj == null) return obj
  if (Array.isArray(obj)) return obj.map(preprocessSchema)
  if (typeof obj !== "object") return obj

  const result = Object.entries(obj)
    .filter(([key, value]) => {
      if (key === "additionalProperties" && value === false) return false
      if (key === "multipleOf") return false
      return true
    })
    .reduce<Schema>((acc, [key, value]) => {
      acc[key] = preprocessSchema(value)
      return acc
    }, {})

  if (result["x-nullable"] === true || result.nullable === true) {
    return makeNullable(result)
  }

  return result
}

function makeNullable(schema: Schema): Schema {
  const rest = {...schema}
  delete rest["x-nullable"]
  delete rest.nullable

  const withEnum = Array.isArray(rest.enum) && !rest.enum.includes(null)
    ? {...rest, enum: [...rest.enum, null]}
    : rest

  if (typeof withEnum.type === "string") {
    return {...withEnum, type: [withEnum.type, "null"]}
  }

  if (Array.isArray(withEnum.type)) {
    return withEnum.type.includes("null")
      ? withEnum
      : {...withEnum, type: [...withEnum.type, "null"]}
  }

  return {anyOf: [withEnum, {type: "null"}]}
}

function compileSchema(rawSchema: unknown, spec: Schema): ValidateFunction {
  const definitions = Object.fromEntries(
    Object.entries(getSchemaDefinitions(spec)).map(([key, val]) => [
      key,
      normalizeComponentRefs(preprocessSchema(val)),
    ]),
  )

  return addFormats(new Ajv({strict: false, allErrors: true})).compile({
    definitions,
    allOf: [normalizeComponentRefs(preprocessSchema(rawSchema))],
  })
}

function getOperation(spec: Schema, endpoint: string, method: string): Schema {
  const operation = spec.paths?.[endpoint]?.[method]
  if (!operation)
    throw new Error(
      `No operation found for ${method.toUpperCase()} ${endpoint}`,
    )
  return operation
}

function getBodySchema(
  spec: Schema,
  endpoint: string,
  method: string,
): Schema | undefined {
  const operation = getOperation(spec, endpoint, method)
  return operation.requestBody?.content?.["application/json"]?.schema
}

function getResponseSchema(
  spec: Schema,
  endpoint: string,
  method: string,
  statusCode: string,
): Schema | undefined {
  const operation = getOperation(spec, endpoint, method)
  return operation.responses?.[statusCode]?.content?.["application/json"]?.schema
}

// -- Error formatting -- //

function getValueAtPath(data: unknown, jsonPath: string): unknown {
  if (!jsonPath) return data

  let current: unknown = data
  for (const segment of jsonPath.split("/").filter(Boolean)) {
    if (current == null || typeof current !== "object") return undefined
    current = (current as Schema)[segment]
  }
  return current
}

function describeValue(value: unknown): string {
  if (value === undefined) return "undefined"
  if (value === null) return "null"
  if (Array.isArray(value)) return `array (length ${value.length})`
  if (typeof value === "string") {
    const truncated = value.length > 50 ? value.slice(0, 50) + "..." : value
    return `"${truncated}"`
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value)
  }
  return `${typeof value}`
}

function getErrorPath(error: Schema): string {
  const missingProp = error.params?.missingProperty as string | undefined
  if (missingProp) return `${error.instancePath || ""}/${missingProp}`
  return error.instancePath || ""
}

function formatSingleError(error: Schema, data?: unknown): string {
  const errorPath = getErrorPath(error)
  const location = errorPath ? `at "${errorPath}"` : "at root"

  let line = `- ${location}: OpenAPI states: ${error.message}`
  if (data !== undefined) {
    line += `, received ${describeValue(getValueAtPath(data, errorPath))}`
  }
  return line
}

function truncatePreview(data: unknown): string {
  const json = JSON.stringify(data, null, 2)
  return json.length > 500 ? json.slice(0, 500) + "\n..." : json
}

function formatErrors(validate: ValidateFunction, data?: unknown): string {
  if (!validate.errors?.length) return "No errors"

  const lines = validate.errors.map((e) => formatSingleError(e, data))

  if (data !== undefined) {
    lines.push("", "Received:", truncatePreview(data))
  }

  return lines.join("\n")
}

// -- Public API -- //

export function createRequestValidator(
  spec: Schema,
  endpoint: string,
  method: string,
): ValidateFunction | null {
  const schema = getBodySchema(spec, endpoint, method)
  return schema ? compileSchema(schema, spec) : null
}

export function createResponseValidator(
  spec: Schema,
  endpoint: string,
  method: string,
  statusCode: string,
): ValidateFunction | null {
  const schema = getResponseSchema(spec, endpoint, method, statusCode)
  return schema ? compileSchema(schema, spec) : null
}

export function assertMatchesOpenApi(
  validate: ValidateFunction,
  data: unknown,
  label: string,
): void {
  const valid = validate(data)
  if (!valid) {
    throw new Error(
      `${label} does not match OpenAPI schema (TypeScript types may be out of sync):\n${formatErrors(validate, data)}`,
    )
  }
}
