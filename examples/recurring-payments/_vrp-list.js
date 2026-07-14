// Local dev only: the mh-environment nginx proxy uses a self-signed cert.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

const {Moneyhub} = require("../../src/index")

const config = {
  resourceServerUrl: "https://apigateway.dev.127.0.0.1.nip.io/v3",
  identityServiceUrl: "https://identity.dev.127.0.0.1.nip.io",
  client: {
    client_id: "0a875ff0-b480-435f-ace9-a34a28da19fa",
    client_secret: "9041953d-19ae-412a-bcc9-c963d32b6312",
    token_endpoint_auth_method: "client_secret_basic",
    id_token_signed_response_alg: "RS256",
    request_object_signing_alg: "HS256",
    redirect_uri: "https://adminportal.dev.127.0.0.1.nip.io",
    response_type: "code",
    keys: [],
  },
}

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)
    const result = await moneyhub.getRecurringPayments({limit: 10, offset: 0})
    console.log(JSON.stringify(result, null, 2))
  } catch (e) {
    console.error("statusCode:", e.response && e.response.statusCode)
    const body = e.response && e.response.body
    console.error("body:", typeof body === "string" ? body : JSON.stringify(body, null, 2))
    if (!e.response) console.error("raw:", e.message || e)
  }
}

start()
