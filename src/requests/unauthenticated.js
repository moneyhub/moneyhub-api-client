module.exports = ({config, request}) => {
  const {resourceServerUrl, identityServiceUrl} = config
  return {
    getGlobalCounterparties: () =>
      request(resourceServerUrl + "/global-counterparties"),
    listConnections: () =>
      request(identityServiceUrl + "/.well-known/all-connections"),
    listAPIConnections: () =>
      request(identityServiceUrl + "/.well-known/api-connections"),
    listTestConnections: () =>
      request(identityServiceUrl + "/.well-known/test-connections"),
    getOpenIdConfig: () =>
      request(identityServiceUrl + "/.well-known/openid-configuration"),
  }
}
