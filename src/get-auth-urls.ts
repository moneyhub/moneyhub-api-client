import got from "got"
import * as R from "ramda"
import {ApiClientConfig} from "../types/config"
import {GetAuthUrlsMethods} from "../types/get-auth-urls"
const filterUndefined = R.reject(R.isNil)

export default ({
  client,
  config,
}: {
  client: any
  config: ApiClientConfig
}): GetAuthUrlsMethods => {
  const {
    identityServiceUrl,
    client: {
      client_id,
      request_object_signing_alg,
      redirect_uri,
      response_type,
    },
  } = config

  const setPermissionsToClaims = (permissions: string[]) => (claims: object) => {
    if (permissions && R.is(Array, permissions)) {
      return R.mergeDeepRight(claims, {
        id_token: {
          "mh:consent": {
            essential: true,
            value: {
              permissions,
            },
          },
        },
      })
    }

    return claims
  }

  const getAuthorizeUrl: GetAuthUrlsMethods["getAuthorizeUrl"] = ({
    state,
    scope,
    nonce,
    claims = {},
    permissions = [],
    enableAsync,
    expirationDateTime,
    transactionFromDateTime,
  }) => {
    const defaultClaims = {
      id_token: {
        sub: {
          essential: true,
        },
        "mh:con_id": {
          essential: true,
        },
        ...(expirationDateTime || transactionFromDateTime) && {
          "mh:consent": {
            "essential": true,
            "value": {
              ...expirationDateTime && {expirationDateTime},
              ...transactionFromDateTime && {transactionFromDateTime},
            },
          },
        },
        ...enableAsync && {
          "mh:sync": {
            "essential": true,
            "value": {"enableAsync": true},
          },
        },
      },
    }

    const _claims = R.compose(
      setPermissionsToClaims(permissions),
      R.mergeDeepRight(defaultClaims),
    )(claims)

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
        },
      )
      .then((request: any) => ({
        ...authParams,
        request,
      }))
      .then(client.authorizationUrl.bind(client))
  }

  const getAuthorizeUrlFromRequestUri: GetAuthUrlsMethods["getAuthorizeUrlFromRequestUri"] = ({requestUri}) => {
    return `${client.issuer.authorization_endpoint}?request_uri=${requestUri}`
  }

  const requestObject: GetAuthUrlsMethods["requestObject"] = ({scope, state, claims, nonce}) => {
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

  const getRequestUri: GetAuthUrlsMethods["getRequestUri"] = async (requestObject) => {
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
      permissions = [],
      expirationDateTime,
      transactionFromDateTime,
      enableAsync,
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
      const _claims = R.compose(
        setPermissionsToClaims(permissions),
        R.mergeDeepRight(defaultClaims),
      )(claims)

      const url = await getAuthorizeUrl({
        state,
        nonce,
        scope,
        claims: _claims,
        expirationDateTime,
        transactionFromDateTime,
        enableAsync,
      })
      return url
    },

    getReauthAuthorizeUrlForCreatedUser: async ({
      userId,
      connectionId,
      state,
      nonce,
      claims = {},
      expirationDateTime,
      transactionFromDateTime,
      enableAsync,
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
        expirationDateTime,
        transactionFromDateTime,
        enableAsync,
      })
      return url
    },

    getReconsentAuthorizeUrlForCreatedUser: async ({
      userId,
      connectionId,
      expiresAt,
      state,
      nonce,
      claims = {},
    }) => {
      const scope = "openid reconsent"
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
          "mh:consent": {
            value: {
              expirationDateTime: expiresAt,
            },
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
      expirationDateTime,
      transactionFromDateTime,
      enableAsync,
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
        expirationDateTime,
        transactionFromDateTime,
        enableAsync,
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
      userId,
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
          ...userId && {
            sub: {
              value: userId,
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
      amount,
      claims = {},
      payerId,
      payerType,
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
              payerId,
              payerType,
              paymentId,
              amount,
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

    getRecurringPaymentAuthorizeUrl: async ({
      bankId,
      payeeId,
      payeeType,
      payerId,
      payerType,
      reference,
      validFromDate,
      validToDate,
      maximumIndividualAmount,
      currency,
      periodicLimits,
      type,
      context,
      state,
      nonce,
      userId,
      claims = {},
    }) => {
      if (!state) {
        console.error("State is required")
        throw new Error("Missing parameters")
      }

      const scope = `recurring_payment:create openid id:${bankId}`
      const defaultClaims = {
        id_token: {
          "mh:con_id": {
            essential: true,
          },
          "mh:recurring_payment": {
            essential: true,
            value: {
              payeeId,
              payeeType,
              payerId,
              payerType,
              reference,
              validFromDate,
              validToDate,
              maximumIndividualAmount,
              currency,
              periodicLimits,
              type,
              context,
            },
          },
          ...userId && {
            sub: {
              value: userId,
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

    getPushedAuthorisationRequestUrl: async ({
      bankId,
      state,
      nonce,
      userId,
      claims = {},
      permissions = [],
      expirationDateTime,
      transactionFromDateTime,
      enableAsync,
      codeChallenge,
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

      const _claims = R.compose(
        setPermissionsToClaims(permissions),
        R.mergeDeepRight(defaultClaims),
      )(claims)

      const authParams = filterUndefined({
        client_id,
        scope,
        state,
        nonce,
        redirect_uri,
        response_type,
        prompt: "consent",
      })

      const pkceParams = codeChallenge && {
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
      }

      const request = await client.requestObject(
        {
          ...authParams,
          ...pkceParams,
          claims: _claims,
          expirationDateTime,
          transactionFromDateTime,
          enableAsync,
        },
        {
          sign: request_object_signing_alg,
        })

      const pushedRequest = await client.pushedAuthorizationRequest({request})

      const url = client.authorizationUrl(pushedRequest)

      return url
    },

  }
}
