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

function getOperation(spec: Schema, path: string, method: string): Schema {
  const operation = spec.paths?.[path]?.[method]
  if (!operation) throw new Error(`No operation found for ${method.toUpperCase()} ${path}`)
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

function getBodySchema(spec: Schema, path: string, method: string): Schema | undefined {
  const operation = getOperation(spec, path, method)
  const params: Schema[] = (operation.parameters ?? []).map(
    (p: Schema) => resolveParamRef(spec, p),
  )
  const bodyParam = params.find((p) => p.in === "body")
  return bodyParam?.schema
}

function getResponseSchema(spec: Schema, path: string, method: string, statusCode: string): Schema | undefined {
  const operation = getOperation(spec, path, method)
  return operation.responses?.[statusCode]?.schema
}

export async function fetchSwaggerSpec(url: string): Promise<Schema> {
  const cached = specCache.get(url)
  if (cached) return cached
  const {body} = await got(url, {responseType: "json"})
  const spec = body as Schema
  specCache.set(url, spec)
  return spec
}

export function createRequestValidator(spec: Schema, path: string, method: string): ValidateFunction | null {
  const schema = getBodySchema(spec, path, method)
  return schema ? compileSchema(schema, spec) : null
}

export function createResponseValidator(spec: Schema, path: string, method: string, statusCode: string): ValidateFunction | null {
  const schema = getResponseSchema(spec, path, method, statusCode)
  return schema ? compileSchema(schema, spec) : null
}

function resolvePathValue(data: unknown, instancePath: string): unknown {
  if (!instancePath) return data
  const segments = instancePath.split("/").filter(Boolean)
  let current: unknown = data
  for (const seg of segments) {
    if (current == null || typeof current !== "object") return undefined
    current = (current as Schema)[seg]
  }
  return current
}

function describeValue(value: unknown): string {
  if (value === undefined) return "undefined"
  if (value === null) return "null"
  if (Array.isArray(value)) return `array (length ${value.length})`
  if (typeof value === "string") return `string ("${value.length > 50 ? value.slice(0, 50) + "..." : value}")`
  return `${typeof value} (${String(value)})`
}

export function formatErrors(validate: ValidateFunction, data?: unknown): string {
  if (!validate.errors?.length) return "No errors"

  const lines = validate.errors.map((e) => {
    const missingProp = (e.params as Schema)?.missingProperty as string | undefined
    const fullPath = missingProp
      ? `${e.instancePath || ""}/${missingProp}`
      : e.instancePath || ""
    const location = fullPath ? `at "${fullPath}"` : "at root"
    const received = data !== undefined
      ? `, received ${describeValue(resolvePathValue(data, fullPath))}`
      : ""
    return `- ${location}: swagger states: ${e.message}${received}`
  })

  if (data !== undefined) {
    const preview = JSON.stringify(data, null, 2)
    const truncated = preview.length > 500 ? preview.slice(0, 500) + "\n..." : preview
    lines.push("", "Received:", truncated)
  }

  return lines.join("\n")
}
