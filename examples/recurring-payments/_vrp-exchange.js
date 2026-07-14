// Local dev only: the mh-environment nginx proxy uses a self-signed cert.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

const {Moneyhub} = require("../../src/index")

// Must match the client/config used by _vrp-consent.js (same redirect_uri,
// state and nonce), otherwise the code exchange will be rejected.
const config = {
  resourceServerUrl: "https://apigateway.dev.127.0.0.1.nip.io/v3",
  identityServiceUrl: "https://identity.dev.127.0.0.1.nip.io",
  client: {
    client_id: "0a875ff0-b480-435f-ace9-a34a28da19fa",
    client_secret: "9041953d-19ae-412a-bcc9-c963d32b6312",
    token_endpoint_auth_method: "client_secret_basic",
    id_token_signed_response_alg: "RS256",
    request_object_signing_alg: "HS256",
    // Must match the redirect_uri used by _vrp-consent.js.
    redirect_uri: "https://identity.dev.127.0.0.1.nip.io/dev-callback",
    response_type: "code",
    keys: [],
  },
}

// Pass EITHER the raw `code` OR the whole redirect URL you were sent to
// (e.g. "https://adminportal.dev.127.0.0.1.nip.io/?code=...&state=foo").
const arg = process.argv[2] || ""
let code = arg
let state = "foo"
try {
  if (arg.includes("://") || arg.includes("code=")) {
    const u = new URL(arg.includes("://") ? arg : "https://x/?" + arg.replace(/^\?/, ""))
    code = u.searchParams.get("code") || code
    state = u.searchParams.get("state") || state
  }
} catch (e) { /* treat arg as a raw code */ }

const start = async () => {
  if (!code) {
    console.error("Usage: node -r ts-node/register examples/recurring-payments/_vrp-exchange.js '<code | full redirect URL>'")
    return
  }
  try {
    const moneyhub = await Moneyhub(config)
    // Exchanging the code completes the authorization request, which creates the
    // connection and flips the VRP consent from InProgress -> Authorised.
    const tokens = await moneyhub.exchangeCodeForTokens({
      paramsFromCallback: {code, state},
      localParams: {state, nonce: "bar", response_type: "code"},
    })
    const claims = typeof tokens.claims === "function" ? tokens.claims() : undefined
    console.log("TOKENS:\n" + JSON.stringify({
      access_token: tokens.access_token ? "(received)" : undefined,
      id_token_claims: claims,
    }, null, 2))

    const list = await moneyhub.getRecurringPayments({limit: 5, offset: 0})
    console.log("CONSENTS AFTER EXCHANGE:\n" + JSON.stringify(list, null, 2))
  } catch (e) {
    console.error("statusCode:", e.response && e.response.statusCode)
    const body = e.response && e.response.body
    console.error("body:", typeof body === "string" ? body : JSON.stringify(body, null, 2))
    if (!e.response) console.error("raw:", e.message || e)
  }
}

start()
