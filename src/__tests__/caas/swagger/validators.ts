import Ajv from "ajv"
import type {ValidateFunction} from "ajv"
import addFormats from "ajv-formats"

type Schema = Record<string, any>

// Recursively strips `additionalProperties: false` (incompatible with allOf in Swagger 2.0)
// and converts `x-nullable: true` to a union type so Ajv accepts null values.
export function preprocessSchema(obj: unknown): unknown {
  if (obj == null) return obj
  if (Array.isArray(obj)) return obj.map(preprocessSchema)
  if (typeof obj !== "object") return obj

  const result = Object.entries(obj)
    .filter(([key, value]) => {
      if (key === "additionalProperties" && value === false) return false
      return true
    })
    .reduce<Schema>((acc, [key, value]) => {
      acc[key] = preprocessSchema(value)
      return acc
    }, {})

  if (result["x-nullable"] === true) {
    return makeNullable(result)
  }

  return result
}

function makeNullable(schema: Schema): Schema {
  const rest = {...schema}
  delete rest["x-nullable"]

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
    Object.entries(spec.definitions ?? {}).map(([key, val]) => [key, preprocessSchema(val)]),
  )

  return addFormats(new Ajv({strict: false, allErrors: true})).compile({
    definitions,
    allOf: [preprocessSchema(rawSchema)],
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

function resolveParamRef(spec: Schema, param: Schema): Schema {
  if (param.$ref) {
    const key = param.$ref.replace("#/parameters/", "")
    return spec.parameters?.[key] ?? param
  }
  return param
}

function getBodySchema(
  spec: Schema,
  endpoint: string,
  method: string,
): Schema | undefined {
  const operation = getOperation(spec, endpoint, method)
  const params: Schema[] = (operation.parameters ?? []).map((p: Schema) =>
    resolveParamRef(spec, p),
  )
  const bodyParam = params.find((p) => p.in === "body")
  return bodyParam?.schema
}

function getResponseSchema(
  spec: Schema,
  endpoint: string,
  method: string,
  statusCode: string,
): Schema | undefined {
  const operation = getOperation(spec, endpoint, method)
  return operation.responses?.[statusCode]?.schema
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

  let line = `- ${location}: swagger states: ${error.message}`
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

export function assertMatchesSwagger(
  validate: ValidateFunction,
  data: unknown,
  label: string,
): void {
  const valid = validate(data)
  if (!valid) {
    throw new Error(
      `${label} does not match swagger schema (TypeScript types may be out of sync):\n${formatErrors(validate, data)}`,
    )
  }
}
