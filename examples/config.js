
const config = {
  resourceServerUrl: "https://api-test.moneyhub.co.uk/v2.0",
  identityServiceUrl: "https://identity-test.moneyhub.co.uk/oidc",
  client: {
    client_id: "your client id",
    client_secret: "your client secret",
    token_endpoint_auth_method: "client_secret_basic",
    id_token_signing_alg: "RS256",
    redirect_uri: "https://your-redirect-uri",
  },
}

module.exports = config
