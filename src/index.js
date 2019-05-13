const {Issuer} = require("openid-client")
const {JWK} = require("node-jose")
const got = require("got")
const R = require("ramda")
const querystring = require("querystring")

Issuer.defaultHttpOptions = {timeout: 60000}

const filterUndefined = R.reject(R.isNil)

module.exports = async ({
  resourceServerUrl,
  identityServiceUrl,
  client: {
    client_id,
    client_secret,
    id_token_signed_response_alg,
    request_object_signing_alg,
    redirect_uri,
    response_type,
    keys,
    token_endpoint_auth_method,
  },
}) => {
  const moneyhubIssuer = await Issuer.discover(identityServiceUrl)
  const keystore = await JWK.asKeyStore({keys})

  const client = new moneyhubIssuer.Client(
    {
      client_id,
      client_secret,
      id_token_signed_response_alg,
      redirect_uri,
      token_endpoint_auth_method,
      request_object_signing_alg,
    },
    keystore
  )

  const moneyhub = {
    keys: () => keystore.toJSON(),

    requestObject: ({scope, state, claims, nonce}) => {
      const authParams = filterUndefined({
        client_id,
        scope,
        state,
        nonce,
        claims,
        exp: Math.round(Date.now() / 1000) + 300,
        redirect_uri,
        response_type,
        prompt: "consent",
      })

      return client.requestObject(authParams)
    },

    createJWKS: async ({keyAlg = "RSA", keySize = 2048, keyUse = "sig", alg = "RS256"}) => {
      const keystore = JWK.createKeyStore()
      await keystore.generate(keyAlg, keySize, {use: keyUse})
      const public = keystore.toJSON()
      const private = keystore.toJSON(true)
      public.keys[0].alg = alg
      return {public, private}
    },

    getRequestUri: async requestObject => {
      const {body} = await got.post(
        identityServiceUrl.replace("oidc", "request"),
        {
          body: requestObject,
          headers: {
            "Content-Type": "application/jws",
          },
        }
      )
      return body
    },

    getAuthorizeUrlFromRequestUri: ({request_uri}) => {
      return `${
        client.issuer.authorization_endpoint
      }?request_uri=${request_uri}`
    },

    getAuthorizeUrl: ({state, scope, nonce, claims = {}}) => {
      const defaultClaims = {
        id_token: {
          sub: {
            essential: true,
          },
          "mh:con_id": {
            essential: true,
          },
        },
      }
      const _claims = R.mergeDeepRight(defaultClaims, claims)

      const authParams = filterUndefined({
        client_id,
        scope,
        state,
        nonce,
        redirect_uri,
        response_type,
        prompt: "consent",
      })

      return client
        .requestObject(
          {
            ...authParams,
            claims: _claims,
            max_age: 86400,
          },
          {
            sign: request_object_signing_alg,
          }
        )
        .then(request => ({
          ...authParams,
          request,
        }))
        .then(client.authorizationUrl.bind(client))
    },
    getAuthorizeUrlForCreatedUser: async ({
      bankId,
      state,
      nonce,
      userId,
      claims = {},
    }) => {
      const scope = `id:${bankId} openid`
      const defaultClaims = {
        id_token: {
          sub: {
            essential: true,
            value: userId,
          },
          "mh:con_id": {
            essential: true,
          },
        },
      }
      const _claims = R.mergeDeepRight(defaultClaims, claims)
      const url = await moneyhub.getAuthorizeUrl({
        state,
        nonce,
        scope,
        claims: _claims,
      })
      return url
    },

    getReauthAuthorizeUrlForCreatedUser: async ({
      userId,
      connectionId,
      state,
      nonce,
      claims = {},
    }) => {
      const scope = "openid reauth"
      const defaultClaims = {
        id_token: {
          sub: {
            essential: true,
            value: userId,
          },
          "mh:con_id": {
            essential: true,
            value: connectionId,
          },
        },
      }
      const _claims = R.mergeDeepRight(defaultClaims, claims)

      const url = await moneyhub.getAuthorizeUrl({
        state,
        nonce,
        scope,
        claims: _claims,
      })
      return url
    },

    getRefreshAuthorizeUrlForCreatedUser: async ({
      userId,
      connectionId,
      state,
      nonce,
      claims = {},
    }) => {
      const scope = "openid refresh"
      const defaultClaims = {
        id_token: {
          sub: {
            essential: true,
            value: userId,
          },
          "mh:con_id": {
            essential: true,
            value: connectionId,
          },
        },
      }
      const _claims = R.mergeDeepRight(defaultClaims, claims)

      const url = await moneyhub.getAuthorizeUrl({
        state,
        scope,
        nonce,
        claims: _claims,
      })
      return url
    },

    getPaymentAuthorizeUrl: async ({
      bankId,
      payeeId,
      amount,
      payeeRef,
      payerRef,
      state,
      nonce,
      claims = {},
    }) => {

      const scope = `payment openid id:${bankId}`
      const defaultClaims = {
        id_token: {
          "mh:con_id": {
            essential: true,
          },
          "mh:payment": {
            essential: true,
            value: {
              amount,
              payeeRef,
              payerRef,
              payeeId,
            },
          },
        },
      }

      const _claims = R.mergeDeepRight(defaultClaims, claims)

      const request = await moneyhub.requestObject({scope, state, claims: _claims, nonce})
      const requestUri = await moneyhub.getRequestUri(request)
      const url = moneyhub.getAuthorizeUrlFromRequestUri({
        request_uri: requestUri,
      })
      return url
    },

    exchangeCodeForTokens: ({state, code, nonce, id_token}) => {
      const verify = filterUndefined({state, nonce})
      const requestObj = filterUndefined({state, code, id_token, nonce})
      return client.authorizationCallback(redirect_uri, requestObj, verify)
    },
    refreshTokens: refreshToken => client.refresh(refreshToken),

    getClientCredentialTokens: ({scope, sub}) =>
      client.grant({
        grant_type: "client_credentials",
        scope,
        sub,
      }),
    registerUserWithToken: (id, token) =>
      got
        .post(identityServiceUrl.replace("oidc", "users"), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          json: true,
          body: {clientUserId: id},
        })
        .then(R.prop("body")),
    registerUser: async id => {
      const {access_token} = await moneyhub.getClientCredentialTokens({
        scope: "user:create",
      })
      return moneyhub.registerUserWithToken(id, access_token)
    },
    getUserConnections: async (userId) => {
      const {access_token} = await moneyhub.getClientCredentialTokens({
        scope: "user:read",
      })
      return moneyhub.getUserConnectionsWithToken(
        userId,
        access_token
      )
    },
    getUserConnectionsWithToken: async (userId, token) => {
      return got.get(
        identityServiceUrl.replace(
          "oidc",
          `users/${userId}/connections`
        ),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          json: true,
        }
      )
    },
    deleteUserConnection: async (userId, connectionId) => {
      const {access_token} = await moneyhub.getClientCredentialTokens({
        scope: "user:delete",
      })
      return moneyhub.deleteUserConnectionWithToken(
        userId,
        connectionId,
        access_token
      )
    },
    deleteUserConnectionWithToken: async (userId, connectionId, token) => {
      return got.delete(
        identityServiceUrl.replace(
          "oidc",
          `users/${userId}/connection/${connectionId}`
        ),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          json: true,
        }
      )
    },
    deleteUser: async (userId) => {
      const {access_token} = await moneyhub.getClientCredentialTokens({
        scope: "user:delete",
      })
      return moneyhub.deleteUserWithToken(
        userId,
        access_token
      )
    },
    deleteUserWithToken: async (userId, token) => {
      return got.delete(
        identityServiceUrl.replace(
          "oidc",
          `users/${userId}`
        ),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          json: true,
        }
      )
    },
    getUsers: async (params = {}) => {
      const {access_token} = await moneyhub.getClientCredentialTokens({
        scope: "user:read",
      })
      const url = `${identityServiceUrl.replace(
        "oidc",
        "users"
      )}?${querystring.stringify(params)}`

      return got(url, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        json: true,
      }).then(R.prop("body"))
    },
    getUser: async id => {
      const {access_token} = await moneyhub.getClientCredentialTokens({
        scope: "user:read",
      })
      return got(identityServiceUrl.replace("oidc", `users/${id}`), {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        json: true,
      }).then(R.prop("body"))
    },
    getAccounts: token =>
      got(resourceServerUrl + "/accounts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        json: true,
      }).then(R.prop("body")),
    getAccount: async accountId => {
      const {access_token} = await moneyhub.getClientCredentialTokens({
        scope: "accounts:read",
      })

      return got(resourceServerUrl + "/accounts/" + accountId, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        json: true,
      }).then(R.prop("body"))
    },
    getTransactions: token =>
      got(resourceServerUrl + "/transactions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        json: true,
      }).then(R.prop("body")),

    addPayee: async ({accountNumber, sortCode, name}) => {
      const {access_token} = await moneyhub.getClientCredentialTokens({
        scope: "payee:create",
      })
      return got
        .post(identityServiceUrl.replace("oidc", "payees"), {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          json: true,
          body: {accountNumber, sortCode, name},
        })
        .then(R.prop("body"))
    },

    getPayees: async (params = {}) => {
      const {access_token} = await moneyhub.getClientCredentialTokens({
        scope: "payee:read",
      })

      const url = `${identityServiceUrl.replace(
        "oidc",
        "payees"
      )}?${querystring.stringify(params)}`

      return got(url, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        json: true,
      }).then(R.prop("body"))
    },

    getPayments: async (params = {}) => {
      const {access_token} = await moneyhub.getClientCredentialTokens({
        scope: "payment:read",
      })
      const url = `${identityServiceUrl.replace(
        "oidc",
        "payments"
      )}?${querystring.stringify(params)}`

      return got(url, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        json: true,
      }).then(R.prop("body"))
    },

    getPayment: async (id) => {
      const {access_token} = await moneyhub.getClientCredentialTokens({
        scope: "payment:read",
      })
      const url = `${identityServiceUrl.replace(
        "oidc",
        "payments"
      )}/${id}`

      return got(url, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        json: true,
      }).then(R.prop("body"))
    },

    listConnections: () =>
      got(identityServiceUrl + "/.well-known/all-connections", {
        json: true,
      }).then(R.prop("body")),

    listAPIConnections: () =>
      got(identityServiceUrl + "/.well-known/api-connections", {
        json: true,
      }).then(R.prop("body")),

    listTestConnections: () =>
      got(identityServiceUrl + "/.well-known/test-connections", {
        json: true,
      }).then(R.prop("body")),

    getOpenIdConfig: () =>
      got(identityServiceUrl + "/.well-known/openid-configuration", {
        json: true,
      }),
  }
  return moneyhub
}
