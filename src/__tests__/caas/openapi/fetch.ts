import got from "got"

type Schema = Record<string, any>

const specCache = new Map<string, Schema>()

function normalizeSpecUrl(url: string): string {
  return url.replace(
    "/caas/swagger-enrichment-engine.json",
    "/caas/openapi.json",
  )
}

export async function fetchOpenApiSpec(url: string | undefined): Promise<Schema> {
  if (!url) {
    throw new Error(
      "Missing caas.openapiUrl in config. Expected structure:\n" +
      JSON.stringify(
        {caas: {openapiUrl: "https://<api-gateway>.co.uk/caas/openapi.json"}},
        null,
        2,
      ),
    )
  }

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
