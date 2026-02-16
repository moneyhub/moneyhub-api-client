import qs from "query-string"
import {rewriteDiscoveryUrls} from "../discovery"
import {RequestsParams, ExtraOptions} from "../request"
import {UnauthenticatedRequests} from "./types/unauthenticated"

export default ({config, request}: RequestsParams): UnauthenticatedRequests => {
  const {resourceServerUrl, identityServiceUrl} = config
  return {
    getGlobalCounterparties: (params = {}, options?: ExtraOptions) =>
      request(`${resourceServerUrl}/global-counterparties`, {
        searchParams: params,
        options,
      }),
    listConnections: (query?: {clientId?: string}) =>
      request(`${identityServiceUrl}/oidc/.well-known/all-connections?${query && qs.stringify(query)}`),
    listAPIConnections: (query?: {clientId?: string}) =>
      request(`${identityServiceUrl}/oidc/.well-known/api-connections?${query && qs.stringify(query)}`),
    listTestConnections: (query?: {clientId?: string}) =>
      request(`${identityServiceUrl}/oidc/.well-known/test-connections?${query && qs.stringify(query)}`),
    listPaymentsConnections: (query?: {clientId?: string}) =>
      request(`${identityServiceUrl}/oidc/.well-known/payments-connections?${query && qs.stringify(query)}`),
    listBetaConnections: (query?: {clientId?: string}) =>
      request(`${identityServiceUrl}/oidc/.well-known/beta-connections?${query && qs.stringify(query)}`),
    getOpenIdConfig: async () => {
      const ttl = config.openIdConfigCacheTtlMs ?? 0
      const cache = config.oidcCache
      const now = Date.now()
      if (cache != null && ttl > 0 && now - cache.cachedAt < ttl) {
        return cache.value
      }
      const raw = await request(`${identityServiceUrl}/oidc/.well-known/openid-configuration`) as Record<string, unknown>
      const issuer = raw?.issuer
      const value =
        issuer && typeof issuer === "string"
          ? (rewriteDiscoveryUrls(
            raw,
            issuer.replace(/\/$/, ""),
            (identityServiceUrl.replace(/\/oidc\/?$/, "") + "/oidc").replace(/\/$/, ""),
          ) as Record<string, unknown>)
          : raw
      if (config.oidcCache != null) {
        config.oidcCache.value = value
        config.oidcCache.cachedAt = Date.now()
      }
      return value
    },
  }
}
