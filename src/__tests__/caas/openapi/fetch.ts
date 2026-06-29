import got from "got"

type Schema = Record<string, any>

const specCache = new Map<string, Schema>()

function normalizeSpecUrl(url: string): string {
  return url.replace(
    "/caas/swagger-enrichment-engine.json",
    "/caas/openapi.json",
  )
}

export function getCaasBaseUrl(apiConfig: Record<string, any>): string | undefined {
  if (apiConfig.gatewayCaasResourceServerUrl) {
    return apiConfig.gatewayCaasResourceServerUrl
  }

  if (apiConfig.caasResourceServerUrl) {
    return apiConfig.caasResourceServerUrl
  }

  if (apiConfig.resourceServerUrl) {
    return `${apiConfig.resourceServerUrl.replace(/\/v\d+(\.\d+)?\b/, "")}/caas/v1`
  }

  return undefined
}

export function deriveOpenApiUrl(caasBaseUrl: string): string {
  const url = new URL(caasBaseUrl)
  url.pathname = `${url.pathname.replace(/\/v\d+\/?$/, "").replace(/\/$/, "")}/openapi.json`
  return url.toString()
}

export function resolveOpenApiUrl(apiConfig: Record<string, any>): string | undefined {
  if (apiConfig.caas?.openapiUrl) {
    return apiConfig.caas.openapiUrl
  }

  const caasBaseUrl = getCaasBaseUrl(apiConfig)
  if (!caasBaseUrl) {
    return undefined
  }

  return deriveOpenApiUrl(caasBaseUrl)
}

export async function fetchOpenApiSpec(url: string | undefined): Promise<Schema> {
  if (!url) {
    throw new Error(
      "Could not resolve caas.openapiUrl. Set caas.openapiUrl explicitly or provide " +
      "gatewayCaasResourceServerUrl, caasResourceServerUrl, or resourceServerUrl in config.",
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
