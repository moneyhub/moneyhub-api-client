import {RequestsParams, ExtraOptions} from "../request"
import {stringify} from "../stringify-query"
import {UnauthenticatedRequests} from "./types/unauthenticated"

export default ({config, request}: RequestsParams): UnauthenticatedRequests => {
  const {resourceServerUrl, identityServiceUrl, getOpenIdConfig} = config
  return {
    getGlobalCounterparties: (params = {}, options?: ExtraOptions) =>
      request(`${resourceServerUrl}/global-counterparties`, {
        searchParams: params,
        options,
      }),
    listConnections: (query?: {clientId?: string}) =>
      request(`${identityServiceUrl}/oidc/.well-known/all-connections?${query && stringify(query)}`),
    listAPIConnections: (query?: {clientId?: string}) =>
      request(`${identityServiceUrl}/oidc/.well-known/api-connections?${query && stringify(query)}`),
    listLegacyConnections: (query?: {clientId?: string}) =>
      request(`${identityServiceUrl}/oidc/.well-known/legacy-connections?${query && stringify(query)}`),
    listTestConnections: (query?: {clientId?: string}) =>
      request(`${identityServiceUrl}/oidc/.well-known/test-connections?${query && stringify(query)}`),
    listPaymentsConnections: (query?: {clientId?: string}) =>
      request(`${identityServiceUrl}/oidc/.well-known/payments-connections?${query && stringify(query)}`),
    listBetaConnections: (query?: {clientId?: string}) =>
      request(`${identityServiceUrl}/oidc/.well-known/beta-connections?${query && stringify(query)}`),
    getOpenIdConfig: () => getOpenIdConfig(),
  }
}
