// Local dev only: the mh-environment nginx proxy uses a self-signed cert.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const { Moneyhub } = require("../../src/index");

const config = {
  resourceServerUrl: "https://apigateway.dev.127.0.0.1.nip.io/v3",
  identityServiceUrl: "https://identity.dev.127.0.0.1.nip.io",
  client: {
    client_id: "0a875ff0-b480-435f-ace9-a34a28da19fa",
    client_secret: "9041953d-19ae-412a-bcc9-c963d32b6312",
    token_endpoint_auth_method: "client_secret_basic",
    id_token_signed_response_alg: "RS256",
    request_object_signing_alg: "HS256",
    // Non-redirecting URI: identity 404s this path, so the browser stays put
    // with ?code=...&state=foo visible in the address bar (no admin-portal/Auth0).
    redirect_uri: "https://identity.dev.127.0.0.1.nip.io/dev-callback",
    response_type: "code",
    keys: [],
  },
};

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config);
    const url = await moneyhub.getRecurringPaymentAuthorizeUrl({
      bankId: "1ffe704d39629a929c8e293880fb449a",
      payee: {
        name: "VRP Test Payee",
        accountNumber: "12345678",
        sortCode: "010101",
      },
      reference: "Sweep test",
      maximumIndividualAmount: 10000,
      currency: "GBP",
      periodicLimits: [
        {
          amount: 50000,
          currency: "GBP",
          periodType: "Month",
          periodAlignment: "Consent",
        },
      ],
      type: "Sweeping",
      context: "PartyToParty",
      state: "foo",
      nonce: "bar",
    });
    console.log("CONSENT URL:\n" + url);
  } catch (e) {
    console.error("statusCode:", e.response && e.response.statusCode);
    const body = e.response && e.response.body;
    console.error(
      "body:",
      typeof body === "string" ? body : JSON.stringify(body, null, 2),
    );
    if (!e.response) console.error("raw:", e.message || e);
  }
};

start();
