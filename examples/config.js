const config = {
  resourceServerUrl: "https://api.moneyhub.co.uk/v2.0",
  identityServiceUrl: "https://identity.moneyhub.co.uk/oidc",
  accountConnectUrl: "https://bank-chooser.moneyhub.co.uk/account-connect.js",
  client: {
    client_id: "your client id",
    client_secret: "your client secret",
    token_endpoint_auth_method: "client_secret_basic",
    id_token_signed_response_alg: "RS256",
    request_object_signing_alg: "none",
    redirect_uri: "https://your-redirect-uri",
    response_type: "code",
    keys: [

      /* your jwks */
    ],
  },
}

module.exports = config
