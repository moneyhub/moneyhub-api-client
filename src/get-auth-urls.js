const got = require("got")
const R = require("ramda")
const filterUndefined = R.reject(R.isNil)

module.exports = ({client, config}) => {
  const {
    identityServiceUrl,
    client: {
      client_id,
      request_object_signing_alg,
      redirect_uri,
      response_type,
    },
  } = config

  const getAuthorizeUrl = ({state, scope, nonce, claims = {}}) => {
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
      .then((request) => ({
        ...authParams,
        request,
      }))
      .then(client.authorizationUrl.bind(client))
  }

  const getAuthorizeUrlFromRequestUri = ({requestUri}) => {
    return `${client.issuer.authorization_endpoint}?request_uri=${requestUri}`
  }

  const requestObject = ({scope, state, claims, nonce}) => {
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
  }

  const getRequestUri = async (requestObject) => {
    const {body} = await got.post(identityServiceUrl + "/request", {
      body: requestObject,
      headers: {
        "Content-Type": "application/jws",
      },
    })
    return body
  }

  return {
    getAuthorizeUrl,
    getAuthorizeUrlFromRequestUri,
    requestObject,
    getRequestUri,
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
      const url = await getAuthorizeUrl({
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

      const url = await getAuthorizeUrl({
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

      const url = await getAuthorizeUrl({
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
      state,
      nonce,
      context,
      readRefundAccount,
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
              context,
              readRefundAccount,
            },
          },
        },
      }

      const _claims = R.mergeDeepRight(defaultClaims, claims)

      const request = await requestObject({
        scope,
        state,
        claims: _claims,
        nonce,
      })

      const requestUri = await getRequestUri(request)
      const url = getAuthorizeUrlFromRequestUri({
        requestUri,
      })
      return url
    },

    getReversePaymentAuthorizeUrl: async ({
      bankId,
      paymentId,
      state,
      nonce,
      claims = {},
    }) => {
      if (!state) {
        console.error("State is required")
        throw new Error("Missing parameters")
      }

      if (!paymentId) {
        console.error("PayeeId is required")
        throw new Error("Missing parameters")
      }

      const scope = `reverse_payment openid id:${bankId}`
      const defaultClaims = {
        id_token: {
          "mh:con_id": {
            essential: true,
          },
          "mh:reverse_payment": {
            essential: true,
            value: {
              paymentId,
            },
          },
          "mh:payment": {
            essential: true,
          },
        },
      }

      const _claims = R.mergeDeepRight(defaultClaims, claims)

      const request = await requestObject({
        scope,
        state,
        claims: _claims,
        nonce,
      })

      const requestUri = await getRequestUri(request)
      const url = getAuthorizeUrlFromRequestUri({
        requestUri,
      })
      return url
    },

    getStandingOrderAuthorizeUrl: async ({
      bankId,
      payeeId,
      payeeType,
      payerId,
      payerType,
      reference,
      frequency,
      numberOfPayments,
      firstPaymentAmount,
      recurringPaymentAmount,
      finalPaymentAmount,
      currency,
      firstPaymentDate,
      recurringPaymentDate,
      finalPaymentDate,
      state,
      nonce,
      context,
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

      const scope = `standing_orders:create openid id:${bankId}`
      const defaultClaims = {
        id_token: {
          "mh:con_id": {
            essential: true,
          },
          "mh:standing_order": {
            essential: true,
            value: {
              payeeId,
              payeeType,
              payerId,
              payerType,
              reference,
              frequency,
              numberOfPayments,
              firstPaymentAmount,
              recurringPaymentAmount,
              finalPaymentAmount,
              currency,
              firstPaymentDate,
              recurringPaymentDate,
              finalPaymentDate,
              context,
            },
          },
        },
      }

      const _claims = R.mergeDeepRight(defaultClaims, claims)

      const request = await requestObject({
        scope,
        state,
        claims: _claims,
        nonce,
      })

      const requestUri = await getRequestUri(request)
      const url = getAuthorizeUrlFromRequestUri({
        requestUri,
      })
      return url
    },

  }
}
