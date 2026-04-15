import got from "got"

type Schema = Record<string, any>

const specCache = new Map<string, Schema>()

export async function fetchSwaggerSpec(
  url: string | undefined,
): Promise<Schema> {
  if (!url) {
    throw new Error(
      "Missing \"caas\" config block. Expected structure:\n" +
        JSON.stringify(
          {
            caas: {
              swaggerUrl:
                "https://<api-gateway>.co.uk/caas/swagger-enrichment-engine.json",
              userId: "user-id-12345678",
              accountId: "account-id-12345678",
            },
          },
          null,
          2,
        ) +
        "\nCaas config must be added to the top level of your client config object",
    )
  }

  const cached = specCache.get(url)
  if (cached) return cached
  const {body} = await got(url, {responseType: "json"})
  const spec = body as Schema
  specCache.set(url, spec)
  return spec
}
