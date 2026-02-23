import {TTLCache} from "@isaacs/ttlcache"
import {rewriteDiscoveryDocForIdentityUrl} from "./discovery"
import type {Request} from "./request"

const OIDC_CACHE_KEY = "oidc"

/**
 * Builds the discovery document URL for the given identity service URL.
 * @param {string} identityServiceUrl - Identity service URL
 * @returns {string} Full URL to the OIDC discovery document
 */
const discoveryUrl = (identityServiceUrl: string): string =>
  identityServiceUrl.replace(/\/oidc\/?$/, "") + "/oidc/.well-known/openid-configuration"

export interface GetOpenIdConfigParams {
  identityServiceUrl: string

  /** When set, discovery endpoint URLs are rewritten to this base. */
  gatewayIdentityServiceUrl?: string
  openIdConfigCacheTtlMs: number
  request: Request
}

/**
 * Creates a getOpenIdConfig function that fetches the OIDC discovery document with optional
 * URL rewriting for gateway use. Uses @isaacs/ttlcache for TTL-based caching when openIdConfigCacheTtlMs > 0.
 *
 * @param {GetOpenIdConfigParams} params - Configuration: identityServiceUrl, optional gatewayIdentityServiceUrl, openIdConfigCacheTtlMs, and the request function used to fetch the discovery document
 * @returns {function(): Promise<Record<string, unknown>>} A function that returns a promise of the discovery document (with endpoint URLs rewritten to gatewayIdentityServiceUrl only when that option is set)
 */
export function createGetOpenIdConfig(params: GetOpenIdConfigParams): () => Promise<Record<string, unknown>> {
  const {identityServiceUrl, gatewayIdentityServiceUrl, openIdConfigCacheTtlMs, request} = params
  const useCache = openIdConfigCacheTtlMs > 0
  const cache = useCache
    ? new TTLCache<string, Record<string, unknown>>({max: 1, ttl: openIdConfigCacheTtlMs})
    : undefined

  return async function getOpenIdConfig(): Promise<Record<string, unknown>> {
    if (useCache && cache) {
      const cached = cache.get(OIDC_CACHE_KEY)
      if (cached) return cached
    }

    const raw = (await request(discoveryUrl(identityServiceUrl))) as Record<string, unknown>
    const rewriteTarget = gatewayIdentityServiceUrl ?? identityServiceUrl
    const value =
      gatewayIdentityServiceUrl && raw?.issuer && typeof raw.issuer === "string"
        ? rewriteDiscoveryDocForIdentityUrl(rewriteTarget, raw)
        : raw

    if (useCache && cache) {
      cache.set(OIDC_CACHE_KEY, value)
    }
    return value
  }
}
