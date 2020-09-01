
const config = {
  resourceServerUrl: "https://api.moneyhub.co.uk/v2.0",
  identityServiceUrl: "https://identity.moneyhub.co.uk/oidc",
  accountConnectUrl: "https://bank-chooser.moneyhub.co.uk/account-connect.js",
  client: {
    client_id: "bee6cc13-d2f6-44c6-b043-5234a204f1ba",
    client_secret: "766fff3a-5131-497f-8048-da86ee98087d",
    token_endpoint_auth_method: "client_secret_basic",
    id_token_signed_response_alg: "RS256",
    request_object_signing_alg: "none",
    redirect_uri: "https://invite.localhost.com",
    response_type: "code",
    keys: [/* your jwks */],
  },
}

module.exports = config
