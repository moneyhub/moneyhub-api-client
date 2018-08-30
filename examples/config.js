
const config = {
  resourceServerUrl: "https://api-test.moneyhub.co.uk/v2.0",
  identityServiceUrl: "https://identity-test.moneyhub.co.uk/oidc",
  client: {
    client_id: "clientId",
    client_secret: "clientSecret",
    token_endpoint_auth_method: "client_secret_basic",
    id_token_signing_alg: "RS256",
    redirect_uri: "redirectUri",
  },
}

module.exports = config
