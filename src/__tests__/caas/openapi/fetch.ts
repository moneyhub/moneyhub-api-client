import got from "got"

type Schema = Record<string, any>

let skipOpenApiTests = false

export function setSkipOpenApiTests(value: boolean) {
  skipOpenApiTests = value
}

const specCache = new Map<string, Schema>()

function normalizeSpecUrl(url: string): string {
  return url.replace(
    "/caas/swagger-enrichment-engine.json",
    "/caas/openapi.json",
  )
}

function skipOpenApiSuite(): never {
  const err = new Error("OpenAPI tests skipped: missing caas.openapiUrl") as Error & {code?: string}
  err.code = "ERR_MOCHA_SKIPPED"
  throw err
}

function assertOpenApiUrlConfigured(url: string | undefined): asserts url is string {
  if (skipOpenApiTests || !url) {
    skipOpenApiSuite()
  }
}

export async function fetchOpenApiSpec(url: string | undefined): Promise<Schema> {
  assertOpenApiUrlConfigured(url)

  const cached = specCache.get(url)
  if (cached) return cached

  const normalizedUrl = normalizeSpecUrl(url)
  const {body} = await got(normalizedUrl, {responseType: "json"})
  const spec = body as Schema
  specCache.set(url, spec)
  if (normalizedUrl !== url) {
    specCache.set(normalizedUrl, spec)
  }
  return spec
}
