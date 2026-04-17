import got from "got"

type Schema = Record<string, any>

const specCache = new Map<string, Schema>()

export async function fetchSwaggerSpec(url: string | undefined): Promise<Schema> {
  if (!url) {
    throw new Error(
      "Missing caas.swaggerUrl in config. Expected structure:\n" +
      JSON.stringify(
        {caas: {swaggerUrl: "https://<api-gateway>.co.uk/caas/swagger-enrichment-engine.json"}},
        null,
        2,
      ),
    )
  }

  const cached = specCache.get(url)
  if (cached) return cached

  const {body} = await got(url, {responseType: "json"})
  const spec = body as Schema
  specCache.set(url, spec)
  return spec
}
