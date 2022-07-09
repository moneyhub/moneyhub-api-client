import {RequestsParams} from "src/request"
import {UnauthenticatedRequests} from "../../types/requests/unauthenticated"

export default ({config, request}: RequestsParams): UnauthenticatedRequests => {
  const {resourceServerUrl, identityServiceUrl} = config
  return {
    getGlobalCounterparties: (params = {}) =>
      request(resourceServerUrl + "/global-counterparties", {
        searchParams: params,
      }),
    listConnections: () =>
      request(identityServiceUrl + "/oidc/.well-known/all-connections"),
    listAPIConnections: () =>
      request(identityServiceUrl + "/oidc/.well-known/api-connections"),
    listTestConnections: () =>
      request(identityServiceUrl + "/oidc/.well-known/test-connections"),
    listBetaConnections: () =>
      request(identityServiceUrl + "/oidc/.well-known/beta-connections"),
    getOpenIdConfig: () =>
      request(identityServiceUrl + "/oidc/.well-known/openid-configuration"),
  }
}
