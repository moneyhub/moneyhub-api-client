/* eslint-disable no-trailing-spaces */
const {Issuer} = require("openid-client")
const got = require("got")
const R = require("ramda")
const { JWKS } = require('jose')
const querystring = require("querystring")
const exchangeCodeForTokensFactory = require("./exchange-code-for-token")
const FormData = require("form-data")

Issuer.defaultHttpOptions = {timeout: 60000}

const filterUndefined = R.reject(R.isNil)

module.exports = async (config) => {
  const {
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
  } = config
  const moneyhubIssuer = await Issuer.discover(identityServiceUrl)


  const client = new moneyhubIssuer.Client(
    {
      client_id,
      client_secret,
      id_token_signed_response_alg,
      redirect_uri,
      token_endpoint_auth_method,
      request_object_signing_alg,
    },
    {keys},
  )

  client.CLOCK_TOLERANCE = 10

  const exchangeCodeForTokens = exchangeCodeForTokensFactory({
    client,
    redirectUri: redirect_uri,
  })

  const request = require("./request")({client})
  const unauthenticatedRequests = require("./requests/unauthenticated")({request, config})

  const moneyhub = {
    ...unauthenticatedRequests,
    keys: () => keys && keys.length ? (new JWKS.KeyStore({keys})).toJWKS() : null,

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

    createJWKS: async ({
      keyAlg = "RSA",
      keySize = 2048,
      keyUse = "sig",
      alg = "RS256",
    }) => {
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
      return `${client.issuer.authorization_endpoint}?request_uri=${request_uri}`
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
      payeeType,
      amount,
      payeeRef,
      payerRef,
      payerId,
      payerType,
      payerName,
      payerEmail,
      state,
      nonce,
      claims = {},
    }) => {
      if (!state) {
        console.error("State is required")
        throw new Error("Missing parameters")
      }

      if (!payeeId) {
        console.error("PayeeId is required")
        throw new Error("Missing parameters")
      }

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
              payeeType,
              payerId,
              payerType,
              payerName,
              payerEmail,
            },
          },
        },
      }

      const _claims = R.mergeDeepRight(defaultClaims, claims)
      const request = await moneyhub.requestObject({
        scope,
        state,
        claims: _claims,
        nonce,
      })

      const requestUri = await moneyhub.getRequestUri(request)
      const url = moneyhub.getAuthorizeUrlFromRequestUri({
        request_uri: requestUri,
      })
      return url
    },

    exchangeCodeForTokensLegacy: ({state, code, nonce, id_token}) => {
      const verify = filterUndefined({state, nonce})
      const requestObj = filterUndefined({state, code, id_token, nonce})
      return client.authorizationCallback(redirect_uri, requestObj, verify)
    },

    exchangeCodeForTokens: ({paramsFromCallback, localParams}) => {
      if (!paramsFromCallback || !localParams) {
        console.error(`Missing Parameters in exchangeCodeForTokens method.

The signature for this method changed in v3.
The previous function is available at 'exchangeCodeForTokensLegacy'

This function now requires an object with the following properties:

{
  paramsFromCallback: {
    An object with all the params received at your redirect uri.
    The following properties are allowed:
      "code",
      "error",
      "error_description",
      "error_uri",
      "id_token",
      "state",
      "session_state",
  },
  localParams: {
    An object with params that you have in the local session for the user.
    The following properties are supported:
      "state", // required
      "nonce", // required when using 'code id_token'
      "sub", // optional, but without this param, requests where there are missing cookies will fail
      "max_age", // optional
      "response_type" // recommended
      "code_verifier" // required for PKCE
  }
}`
        )
        throw new Error("Missing parameters")
      }
      return exchangeCodeForTokens({paramsFromCallback, localParams})
    },

    refreshTokens: (refreshToken) => client.refresh(refreshToken),

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
    getUserConnections: async userId => {
      const {access_token} = await moneyhub.getClientCredentialTokens({
        scope: "user:read",
      })
      return moneyhub.getUserConnectionsWithToken(userId, access_token)
    },
    getUserConnectionsWithToken: async (userId, token) => {
      return got.get(
        identityServiceUrl.replace("oidc", `users/${userId}/connections`),
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
    deleteUser: async userId => {
      const {access_token} = await moneyhub.getClientCredentialTokens({
        scope: "user:delete",
      })
      return moneyhub.deleteUserWithToken(userId, access_token)
    },
    deleteUserWithToken: async (userId, token) => {
      return got.delete(identityServiceUrl.replace("oidc", `users/${userId}`), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        json: true,
      })
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
    getSCIMUsers: async (params = {}) => {
      const {access_token} = await moneyhub.getClientCredentialTokens({
        scope: "scim_user:read",
      })
      const url = `${identityServiceUrl.replace(
        "oidc",
        "scim/users"
      )}?${querystring.stringify(params)}`

      return got(url, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        json: true,
      }).then(R.prop("body"))
    },
    getAccounts: async (userId, params = {}) => {
      const {access_token} = await moneyhub.getClientCredentialTokens({
        scope: "accounts:read",
        sub: userId,
      })
      const url = `${resourceServerUrl}/accounts?${querystring.stringify(
        params
      )}`

      return got(url, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        json: true,
      }).then(R.prop("body"))
    },

    getAccountsWithDetails: async (userId, params = {}) => {
      const {access_token} = await moneyhub.getClientCredentialTokens({
        scope: "accounts:read accounts_details:read",
        sub: userId,
      })

      const url = `${resourceServerUrl}/accounts?${querystring.stringify(
        params
      )}`

      return got(url, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        json: true,
      }).then(R.prop("body"))
    },

    getAccountsWithToken: (token, params = {}) =>
      got(`${resourceServerUrl}/accounts?${querystring.stringify(params)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        json: true,
      }).then(R.prop("body")),
    getAccount: async (userId, accountId) => {
      const {access_token} = await moneyhub.getClientCredentialTokens({
        scope: "accounts:read",
        sub: userId,
      })

      return got(`${resourceServerUrl}/accounts/${accountId}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        json: true,
      }).then(R.prop("body"))
    },
    getAccountWithDetails: async (userId, accountId) => {
      const {access_token} = await moneyhub.getClientCredentialTokens({
        scope: "accounts:read accounts_details:read",
        sub: userId,
      })

      return got(`${resourceServerUrl}/accounts/${accountId}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        json: true,
      }).then(R.prop("body"))
    },
    getAccountWithToken: (token, accountId) =>
      got(`${resourceServerUrl}/accounts/${accountId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        json: true,
      }).then(R.prop("body")),
    getAccountHoldings: async (userId, accountId) => {
      const {access_token} = await moneyhub.getClientCredentialTokens({
        scope: "accounts:read",
        sub: userId,
      })
      return got(`${resourceServerUrl}/accounts/${accountId}/holdings`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        json: true,
      }).then(R.prop("body"))
    },
    getAccountHoldingsWithMatches: async (userId, accountId) => {
      const {access_token} = await moneyhub.getClientCredentialTokens({
        scope: "accounts:read",
        sub: userId,
      })
      return got(
        `${resourceServerUrl}/accounts/${accountId}/holdings-with-matches`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          json: true,
        }
      ).then(R.prop("body"))
    },
    getAccountHolding: async (userId, accountId, holdingId) => {
      const {access_token} = await moneyhub.getClientCredentialTokens({
        scope: "accounts:read",
        sub: userId,
      })
      return got(
        `${resourceServerUrl}/accounts/${accountId}/holdings/${holdingId}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          json: true,
        }
      ).then(R.prop("body"))
    },
    getAccountHoldingsWithToken: (token, accountId) =>
      got(`${resourceServerUrl}/accounts/${accountId}/holdings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        json: true,
      }).then(R.prop("body")),
    getAccountCounterparties: async (userId, accountId) => {
      const {access_token} = await moneyhub.getClientCredentialTokens({
        scope: "accounts:read transactions:read:all",
        sub: userId,
      })
      return got(`${resourceServerUrl}/accounts/${accountId}/counterparties`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        json: true,
      }).then(R.prop("body"))
    },
    getAccountRecurringTransactions: async (userId, accountId) => {
      const {access_token} = await moneyhub.getClientCredentialTokens({
        scope: "accounts:read transactions:read:all",
        sub: userId,
      })
      return got.post(`${resourceServerUrl}/accounts/${accountId}/recurring-transactions`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        json: true,
      }).then(R.prop("body"))
    },
    getTransactions: async (userId, params = {}) => {
      const {access_token} = await moneyhub.getClientCredentialTokens({
        scope: "transactions:read:all",
        sub: userId,
      })

      const url = `${resourceServerUrl}/transactions?${querystring.stringify(
        params
      )}`

      return got(url, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        json: true,
      }).then(R.prop("body"))
    },
    getTransactionsWithToken: (token, params = {}) =>
      got(
        `${resourceServerUrl}/transactions?${querystring.stringify(params)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          json: true,
        }
      ).then(R.prop("body")),

    syncUserConnectionWithToken: async ({
      accessToken,
      connectionId,
      customerIpAddress,
      customerLastLoggedTime,
    }) => {

      const url = `${resourceServerUrl}/sync/${connectionId}`
      const body = filterUndefined({customerIpAddress, customerLastLoggedTime})

      return got
        .post(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body,
          json: true,
        })
        .then(R.prop("body"))
    },

    syncUserConnection: async ({
      userId,
      connectionId,
      customerIpAddress,
      customerLastLoggedTime,
    }) => {
      const {access_token} = await moneyhub.getClientCredentialTokens({
        scope: "accounts:read accounts:write:all",
        sub: userId,
      })

      return moneyhub.syncUserConnectionWithToken({
        accessToken: access_token,
        connectionId,
        customerIpAddress,
        customerLastLoggedTime,
      })
    },

    addPayee: async ({accountNumber, sortCode, name, externalId}) => {
      const {access_token} = await moneyhub.getClientCredentialTokens({
        scope: "payee:create",
      })
      return got
        .post(identityServiceUrl.replace("oidc", "payees"), {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          json: true,
          body: {accountNumber, sortCode, name, externalId},
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

    getPayee: async id => {
      const {access_token} = await moneyhub.getClientCredentialTokens({
        scope: "payee:read",
      })
      const url = `${identityServiceUrl.replace("oidc", "payees")}/${id}`

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

    getPayment: async id => {
      const {access_token} = await moneyhub.getClientCredentialTokens({
        scope: "payment:read",
      })
      const url = `${identityServiceUrl.replace("oidc", "payments")}/${id}`

      return got(url, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        json: true,
      }).then(R.prop("body"))
    },

    getPaymentFromIDToken: async idToken => {
      try {
        const payload = JSON.parse(Buffer.from(idToken.split(".")[1], "base64").toString())
        const paymentId = payload["mh:payment"]
        return moneyhub.getPayment(paymentId)
      } catch (e) {
        throw new Error("Error retrieving payment from passed in ID Token: " + e.message)
      }
    },

    getProjects: async (userId, params = {}) => {
      const {access_token} = await moneyhub.getClientCredentialTokens({
        scope: "projects:read",
        sub: userId,
      })
      const url = `${resourceServerUrl}/projects?${querystring.stringify(params)}`
      return got(url, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        json: true,
      }).then(R.prop("body"))
    },

    getProject: async (userId, projectId) => {
      const {access_token} = await moneyhub.getClientCredentialTokens({
        scope: "projects:read",
        sub: userId,
      })
      const url = `${resourceServerUrl}/projects/${projectId}`
      return got(url, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        json: true,
      }).then(R.prop("body"))
    },

    addProject: async (userId, projectBody) => {
      const {access_token} = await moneyhub.getClientCredentialTokens({
        scope: "projects:write",
        sub: userId,
      })

      const url = `${resourceServerUrl}/projects`
      return got.post(url, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        body: projectBody,
        json: true,
      }).then(R.prop("body"))
    },

    updateProject: async (userId, projectId, projectBody) => {
      const {access_token} = await moneyhub.getClientCredentialTokens({
        scope: "projects:write",
        sub: userId,
      })

      const url = `${resourceServerUrl}/projects/${projectId}`
      return got.patch(url, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        body: projectBody,
        json: true,
      }).then(R.prop("body"))
    },

    deleteProject: async (userId, projectId) => {
      const {access_token} = await moneyhub.getClientCredentialTokens({
        scope: "projects:delete",
        sub: userId,
      })

      const url = `${resourceServerUrl}/projects/${projectId}`
      return got.delete(url, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        json: true,
      }).then(R.prop("statusCode"))
    },

    addFileToTransaction: async (userId, transactionId, fileData) => {
      const {access_token} = await moneyhub.getClientCredentialTokens({
        scope: "transactions:read:all transactions:write",
        sub: userId,
      })

      const url = `${resourceServerUrl}/transactions/${transactionId}/files`
      const form = new FormData()
      form.append("file", fileData)
      return got.post(url, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        body: form,
      }).then(R.compose(JSON.parse, R.prop("body")))
    },

    getTransactionFiles: async (userId, transactionId) => {
      const {access_token} = await moneyhub.getClientCredentialTokens({
        scope: "transactions:read:all transactions:write",
        sub: userId,
      })

      const url = `${resourceServerUrl}/transactions/${transactionId}/files`
      return got.get(url, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        json: true,
      }).then(R.prop("body"))
    },

    getTransactionFile: async (userId, transactionId, fileId) => {
      const {access_token} = await moneyhub.getClientCredentialTokens({
        scope: "transactions:read:all transactions:write",
        sub: userId,
      })

      const url = `${resourceServerUrl}/transactions/${transactionId}/files/${fileId}`
      return got.get(url, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        json: true,
      }).then(R.prop("body"))
    },

    deleteTransactionFile: async (userId, transactionId, fileId) => {
      const {access_token} = await moneyhub.getClientCredentialTokens({
        scope: "transactions:read:all transactions:write",
        sub: userId,
      })

      const url = `${resourceServerUrl}/transactions/${transactionId}/files/${fileId}`
      return got.delete(url, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        json: true,
      }).then(R.prop("statusCode"))
    },

    getTaxReturn: async (userId, startDate, endDate, {accountId, projectId} = {}) => {
      const {access_token} = await moneyhub.getClientCredentialTokens({
        scope: "tax:read",
        sub: userId,
      })

      const query = R.reject(R.isNil)({startDate, endDate, accountId, projectId})
      const url = `${resourceServerUrl}/tax?${querystring.stringify(query)}`
      return got.get(url, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        json: true,
      }).then(R.prop("body"))
    },

    completeAuthRequest: async ({id, authParams}) => {
      const {access_token} = await moneyhub.getClientCredentialTokens({
        scope: "auth_requests:write",
      })
      return got
        .patch(identityServiceUrl.replace("oidc", `auth-requests/${id}`), {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          json: true,
          body: {authParams},
        })
        .then(R.prop("body"))
    },

    getAuthRequest: async ({id}) => {
      const {access_token} = await moneyhub.getClientCredentialTokens({
        scope: "auth_requests:read",
      })
      return got
        .get(identityServiceUrl.replace("oidc", `auth-requests/${id}`), {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          json: true,
        })
        .then(R.prop("body"))
    },

    getAllAuthRequests: async ({limit, offset}) => {
      const {access_token} = await moneyhub.getClientCredentialTokens({
        scope: "auth_requests:read",
      })
      return got
        .get(
          identityServiceUrl.replace(
            "oidc",
            `auth-requests/?limit=${limit}&offset=${offset}`,
          ),
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
            json: true,
          },
        )
        .then(R.prop("body"))
    },

    createAuthRequest: async ({
      redirectUri,
      payment,
      userId,
      connectionId,
      categorisationType,
      scope,
    }) => {
      const {access_token} = await moneyhub.getClientCredentialTokens({
        scope: "auth_requests:write",
      })

      return got
        .post(identityServiceUrl.replace("oidc", "auth-requests"), {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          json: true,
          body: {redirectUri, payment, userId, connectionId, scope, categorisationType},
        })
        .then(R.prop("body"))
    },

    getGlobalCounterparties: () =>
      got(resourceServerUrl + "/global-counterparties", {
        json: true,
      }).then(R.prop("body")),

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
