import Ajv from "ajv"
import type {ValidateFunction} from "ajv"
import addFormats from "ajv-formats"
import got from "got"

type Schema = Record<string, any>

const specCache = new Map<string, Schema>()

// Strips `additionalProperties: false` (incompatible with allOf in Swagger 2.0)
// and converts `x-nullable: true` to a union type so Ajv accepts null values.
function preprocessSchema(obj: unknown): unknown {
  if (obj == null) return obj
  if (Array.isArray(obj)) return obj.map(preprocessSchema)
  if (typeof obj === "object") {
    const result: Schema = {}
    for (const [key, val] of Object.entries(obj as Schema)) {
      if (key === "additionalProperties" && val === false) continue
      result[key] = preprocessSchema(val)
    }
    if (result["x-nullable"] === true) {
      if (typeof result.type === "string") {
        result.type = [result.type, "null"]
      }
      if (Array.isArray(result.enum)) {
        result.enum = [...result.enum, null]
      }
    }
    return result
  }
  return obj
}

function createAjv() {
  return addFormats(new Ajv({strict: false, allErrors: true}))
}

function getOperation(spec: Schema, endpoint: string, method: string): Schema {
  const operation = spec.paths?.[endpoint]?.[method]
  if (!operation) throw new Error(`No operation found for ${method.toUpperCase()} ${endpoint}`)
  return operation
}

function resolveParamRef(spec: Schema, param: Schema): Schema {
  if (param.$ref) {
    const key = param.$ref.replace("#/parameters/", "")
    return spec.parameters?.[key] ?? param
  }
  return param
}

function compileSchema(rawSchema: unknown, spec: Schema): ValidateFunction {
  const definitions: Schema = {}
  for (const [key, val] of Object.entries(spec.definitions ?? {})) {
    definitions[key] = preprocessSchema(val)
  }
  return createAjv().compile({
    definitions,
    allOf: [preprocessSchema(rawSchema)],
  })
}

function getBodySchema(spec: Schema, endpoint: string, method: string): Schema | undefined {
  const operation = getOperation(spec, endpoint, method)
  const params: Schema[] = (operation.parameters ?? []).map(
    (p: Schema) => resolveParamRef(spec, p),
  )
  const bodyParam = params.find((p) => p.in === "body")
  return bodyParam?.schema
}

function getResponseSchema(spec: Schema, endpoint: string, method: string, statusCode: string): Schema | undefined {
  const operation = getOperation(spec, endpoint, method)
  return operation.responses?.[statusCode]?.schema
}

export async function fetchSwaggerSpec(url: string | undefined): Promise<Schema> {
  if (!url) {
    throw new Error(
      "Missing \"caas\" config block. Expected structure:\n"
      + JSON.stringify({
        caas: {
          swaggerUrl: "https://<api-gateway>.co.uk/caas/swagger-enrichment-engine.json",
          userId: "user-id-12345678",
          accountId: "account-id-12345678",
        },
      }, null, 2)
      + "\nCaas config must be added to the top level of your client config object",
    )
  }

  const cached = specCache.get(url)
  if (cached) return cached
  const {body} = await got(url, {responseType: "json"})
  const spec = body as Schema
  specCache.set(url, spec)
  return spec
}

export function createRequestValidator(spec: Schema, endpoint: string, method: string): ValidateFunction | null {
  const schema = getBodySchema(spec, endpoint, method)
  return schema ? compileSchema(schema, spec) : null
}

export function createResponseValidator(spec: Schema, endpoint: string, method: string, statusCode: string): ValidateFunction | null {
  const schema = getResponseSchema(spec, endpoint, method, statusCode)
  return schema ? compileSchema(schema, spec) : null
}

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
    return `string ("${truncated}")`
  }
  return `${typeof value} (${String(value)})`
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

export function assertMatchesSwagger(validate: ValidateFunction, data: unknown, label: string): void {
  const valid = validate(data)
  if (!valid) {
    throw new Error(
      `${label} does not match swagger schema (TypeScript types may be out of sync):\n${formatErrors(validate, data)}`,
    )
  }
}

function formatErrors(validate: ValidateFunction, data?: unknown): string {
  if (!validate.errors?.length) return "No errors"

  const lines = validate.errors.map((e) => formatSingleError(e, data))

  if (data !== undefined) {
    lines.push("", "Received:", truncatePreview(data))
  }

  return lines.join("\n")
}
