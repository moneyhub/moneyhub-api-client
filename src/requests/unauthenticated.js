module.exports = ({config, request}) => {
  const {resourceServerUrl, identityServiceUrl} = config
  return {
    getGlobalCounterparties: () =>
      request(resourceServerUrl + "/global-counterparties"),
    listConnections: () =>
      request(identityServiceUrl + "/oidc/.well-known/all-connections"),
    listAPIConnections: () =>
      request(identityServiceUrl + "/oidc/.well-known/api-connections"),
    listTestConnections: () =>
      request(identityServiceUrl + "/oidc/.well-known/test-connections"),
    getOpenIdConfig: () =>
      request(identityServiceUrl + "/oidc/.well-known/openid-configuration"),
  }
}
