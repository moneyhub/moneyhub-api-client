// Local dev only: the mh-environment nginx proxy uses a self-signed cert.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const { Moneyhub } = require("../../src/index");

const config2 = {
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

const config = {
  resourceServerUrl: "https://api-dev.moneyhub.co.uk/v2",
  identityServiceUrl: "https://identity-dev.moneyhub.co.uk/oidc",
  accountConnectUrl: "https://bank-chooser.moneyhub.co.uk/account-connect.js",
  client: {
    client_id: "b9e22553-0cf5-46d1-8d5e-7be3d0356cf5",
    client_secret: "c9e40d98-d6f3-4815-9ebd-0b64ec55c33f",
    token_endpoint_auth_method: "private_key_jwt",
    id_token_signed_response_alg: "RS256",
    request_object_signing_alg: "RS256",
    redirect_uri: "https://invite.moneyhub.co.uk/api/callback",
    response_type: "code id_token",
    keys: [
      {
        kty: "RSA",
        n: "qGuMfEzGnhqR1wvli7c7ngjnCXuDwx20jADHnqxlj7dM-OWbDkHHbU6NkBcysl7zsEY6vz1De3-HzHjI_xbOKiTfOCZtMqYGtB7sevqU37BZc8zHjm_eqvZEhiVw1dHgNGxQnbsp4Jcy5lNppK_qLgj2aC3DkQfv3cLZo9ZzAwzqbbMU-4bmvuXTFAzEeZ6-aKXSeuhhUUiAm-DijrFp2YJ36E8AYwaHt922Ny-0C86M928VfknrcifYNuhutlx4p7DxxlH9C-gzV0u4kFtS7vOF9VeoUB_C_E1P7w0d_XBCzlYhHAx2q_WgtXIiNVEZudGmFMpqAsTBTCGJow3TpQ",
        e: "AQAB",
        d: "HZucnKx9nUVT_q9leQirFyb_AMyBNy-1cghgD33Es_14L2hj-B9pwQZWfi6J19A3_HT4Nm79ekxK8hAI28llUITfZhZhS45i7s7h6WO8gM-WhjRJn7l8dmcpWEDkQ36sMOMa0APbgpNqHBItaAmR_GpQcTOcZhZ0XXK4AqS8XtxhJH1cPvaSO3NfYJihAZ78gJpQNliaV4Ee199v_Ly2oT2mnXfDuek1s8vulyaG6br6rSQkPBu4jYQuyQdm4A-4uLO17EAeM7BJ-SVk9XKXzQnY5b--fb0j5fYDYMs4ASsB7uGbD25TsHzn82t3b3YWnfHwkMJi4jnz6XdO59r0UQ",
        p: "0y-d9kzY8tBs0donK7iVGypOMQEUv83QNNbx74ZjpZnGoTMwX5UGKaOZci8w5c2UDDB7EiAynfwWBX0mLzPO0kKFUL4hZfPZTv19rttoSTtkp2hWrI4Ue7kNv3pvGLdxIJ_aRaNX0IYNgMFmeUOLfmkJpH3XfZFlQ_Xf2pOExJU",
        q: "zCi8GLQdxngk8KDvf7fHF5cMQnz6_qPUDlqWtNuGwgAOf-XKDLeEM19fSDCnrL8d75zKIa5RDzUG6X2cdE4Ygw_UySJRw_RbUD2T14bi9NKt33nxECrRk3aZqePxIfp3NQbFRdqFEAeTF0kwKi0rpNYD-5jT22zwL_9ERQ1IftE",
        dp: "fmh2KMN-6HiRalsmLylhNs1v2C1JejV7duViE3lhk_IjzsGRJuVQtwPSCWLt5d_TyigKwqK7KY2GsOpkPMTJ-1kN63KjEx-O55Ub8doq5grDCOGPX-H7qMLv07k5XpYPBPQp9pz7JznWQ0eASv1_Nb8xomAg6GxrLO6ze2XphrE",
        dq: "N8FgLTbzcsJZBEZPYgfknXKo7HeJbIV9YjYnNllFojG1xAQTfAmaVxVSxjpTcH_5QvkE0tHyXT7UFmwxkCnL0-8843k171gKoA1RFOlHjikDRybcSNgIyEb5jEYuEmN-rsKcmYkmEcyfxRo9xyby5l90Uv_Xy_MiXVlPYbRQ-iE",
        qi: "vYJknkg0Fzmqbixl-S3svuPcp_YykEpSNANs4By81Drq58TRBwf-mGWI_m1wd-o8kdH7CH_g4OYoxrRJ0hbJGRSK9JYBzXG2ER6Kb0MHtGst703IrtMerL_aWfZAxmUK7kewFX7sTgMSWWYnEHkn7TIQKiJIcK3EITGT7AQIB7M",
        kid: "qvpxCyT3z3UEl8YxRGagF9BBVi7gBNX2xD6MIIXJ9UI",
        use: "sig",
        alg: "RS256",
      },
    ],
  },
};

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config);
    const url = await moneyhub.getRecurringPaymentAuthorizeUrl({
      bankId: "ec6c9a9d1c152056ea6a018b37a56daf",
      payee: {
        name: "James Allen",
        accountNumber: "03711345",
        sortCode: "040004",
      },
      reference: "CVRP test",
      maximumIndividualAmount: 1000,
      currency: "GBP",
      periodicLimits: [
        {
          amount: 5000,
          currency: "GBP",
          periodType: "Month",
          periodAlignment: "Consent",
        },
      ],
      // Commercial VRP. identity accepts this via additionalRecurringPaymentTypes;
      // the mock-bank oauth-provider instance maps cvrp -> providerCvrpType and
      // replaces Risk with providerCvrpRiskOverride.
      type: "cvrp",
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
