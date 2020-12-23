
const config = {
  resourceServerUrl: "https://api-dev.moneyhub.co.uk/v2.0",
  identityServiceUrl: "https://identity-dev.moneyhub.co.uk/oidc",
  accountConnectUrl: "https://bank-chooser-dev.moneyhub.co.uk/account-connect.js",
  client: {
    client_id: "28282829-c31c-4ac9-a6db-32cdfa6d303a",
    client_secret: "1e06947f-0815-4481-9232-4b2115b9275a",
    token_endpoint_auth_method: "client_secret_basic",
    id_token_signed_response_alg: "RS256",
    request_object_signing_alg: "none",
    redirect_uri: "http://localhost:3001/auth/callback",
    response_type: "code",
    keys: [/* your jwks */],
  },
}

module.exports = config
