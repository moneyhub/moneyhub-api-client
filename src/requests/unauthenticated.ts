import qs from "query-string"
import {RequestsParams} from "../request"
import {UnauthenticatedRequests} from "./types/unauthenticated"

export default ({config, request}: RequestsParams): UnauthenticatedRequests => {
  const {resourceServerUrl, identityServiceUrl} = config
  return {
    getGlobalCounterparties: (params = {}) =>
      request(`${resourceServerUrl}/global-counterparties`, {
        searchParams: params,
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
    getOpenIdConfig: () =>
      request(`${identityServiceUrl}/oidc/.well-known/openid-configuration`),
  }
}
