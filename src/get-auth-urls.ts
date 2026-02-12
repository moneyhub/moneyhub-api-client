import got from "got"
import type {Client} from "openid-client"
import {reject, isNil, mergeDeepRight, compose, is} from "ramda"

import type {ApiClientConfig} from "./schema/config"
import {PayerType, PaymentActorType} from "./schema/payment"
import {StandingOrderFrequency} from "./schema/standing-order"
import {RequestPayee, RequestPayer} from "./schema/payee"
import {PermissionsAction} from "./requests/types/auth-requests"

const filterUndefined = reject(isNil)
type PkceParams = {
  code_challenge: string
  code_challenge_method: string
}
export default ({
  client,
  config,
}: {
  client: Client
  config: ApiClientConfig
}) => {
  const {
    identityServiceUrl,
    client: {
      client_id,
      redirect_uri,
      response_type,
    },
  } = config

  const setPermissionsToClaims = (permissions: any, permissionsAction?: PermissionsAction) => (claims: any) => {
    if (permissions && is(Array, permissions)) {
      return mergeDeepRight(claims, {
        id_token: {
          "mh:consent": {
            essential: true,
            value: {
              permissions,
              permissionsAction: permissionsAction || "add",
            },
          },
        },
      })
    }

    return claims
  }

  const getAuthorizeUrlFromRequestUri = ({requestUri}: {requestUri: string}) => {
    return `${client.issuer.authorization_endpoint}?request_uri=${requestUri}`
  }

  const getRequestObject = ({
    scope,
    state,
    claims,
    nonce,
    pkceParams,
  }: {
    scope: string
    state?: string
    claims: object
    nonce?: string
    pkceParams?: PkceParams
    }) => {
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
      ...pkceParams,
    })

    return client.requestObject(authParams)
  }

  const getAuthorizationUrlFromParams = async ({
    scope,
    state,
    claims,
    nonce,
    pkceParams,
  }: {
    scope: string
    state?: string
    claims: object
    nonce?: string
    pkceParams?: PkceParams
  }) => {
    const request = await getRequestObject({scope, state, claims, nonce, pkceParams})
    const {request_uri: requestUri} = await client.pushedAuthorizationRequest({request})
    const url = getAuthorizeUrlFromRequestUri({
      requestUri,
    })
    return url
  }

  const getAuthorizeUrl = ({
    state,
    scope,
    nonce,
    claims = {},
    permissions,
    permissionsAction,
    enableAsync,
    accVerification,
    expirationDateTime,
    transactionFromDateTime,
    codeChallenge,
  }: {
    state?: string
    scope: string
    nonce?: string
    claims?: any
    permissions?: string[]
    permissionsAction?: PermissionsAction
    enableAsync?: boolean
    accVerification?: boolean
    expirationDateTime?: string
    transactionFromDateTime?: string
    codeChallenge?: string
  }): Promise<string> => {

    const pkceParams = codeChallenge ? {
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    } : undefined

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
          ...accVerification && {
            "mh:account_verification": {
              "essential": true,
              "value": {"accVerification": true},
            },
          },
        },
      },
    }

    const _claims = compose(
      setPermissionsToClaims(permissions, permissionsAction),
      mergeDeepRight(defaultClaims),
    )(claims)

    return getAuthorizationUrlFromParams({
      scope,
      claims: _claims,
      nonce,
      state,
      pkceParams,
    })
  }

  const getAuthorizeUrlLegacy = ({
    state,
    scope,
    nonce,
    claims = {},
    permissions,
    permissionsAction,
    enableAsync,
    expirationDateTime,
    transactionFromDateTime,
    codeChallenge,
  }: {
    state?: string
    scope: string
    nonce?: string
    claims?: any
    permissions?: string[]
    permissionsAction?: PermissionsAction
    enableAsync?: boolean
    expirationDateTime?: string
    transactionFromDateTime?: string
    codeChallenge?: string
  }): Promise<string> => {

    const pkceParams = codeChallenge ? {
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    } : undefined

    const authParams = filterUndefined({
      scope,
      state,
      nonce,
    })

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

    const _claims = compose(
      setPermissionsToClaims(permissions, permissionsAction),
      mergeDeepRight(defaultClaims),
    )(claims)

    return client.requestObject({
      ...pkceParams,
      ...authParams,
      claims: _claims,
      max_age: 86400,
    })
      .then((request) => ({
        ...authParams,
        request,
      }))
      .then(client.authorizationUrl.bind(client))
  }

  const getRequestUri = async (requestObject: any) => {
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
    getAuthorizeUrlLegacy,
    getAuthorizeUrlFromRequestUri,
    requestObject: getRequestObject,
    getRequestUri,
    getAuthorizeUrlForCreatedUser: async ({
      bankId,
      state,
      nonce,
      userId,
      claims = {},
      permissions,
      permissionsAction,
      expirationDateTime,
      transactionFromDateTime,
      enableAsync,
      codeChallenge,
    }:
    {
      bankId: string
      state?: string
      nonce?: string
      userId: string
      claims?: any
      permissions?: string[]
      permissionsAction?: PermissionsAction
      expirationDateTime?: string
      transactionFromDateTime?: string
      enableAsync?: boolean
      codeChallenge?: string
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
      const _claims = compose(
        setPermissionsToClaims(permissions, permissionsAction),
        mergeDeepRight(defaultClaims),
      )(claims)

      const url = await getAuthorizeUrl({
        state,
        nonce,
        scope,
        claims: _claims,
        expirationDateTime,
        transactionFromDateTime,
        permissions,
        permissionsAction,
        enableAsync,
        codeChallenge,
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
      codeChallenge,
    }: {
      userId: string
      connectionId: string
      state?: string
      nonce?: string
      claims?: any
      expirationDateTime?: string
      transactionFromDateTime?: string
      enableAsync?: boolean
      codeChallenge: string
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
      const _claims = mergeDeepRight(defaultClaims, claims)

      const url = await getAuthorizeUrl({
        state,
        nonce,
        scope,
        claims: _claims,
        expirationDateTime,
        transactionFromDateTime,
        enableAsync,
        codeChallenge,
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
      codeChallenge,
    }: {
      userId: string
      connectionId: string
      state?: string
      nonce?: string
      claims?: any
      expiresAt?: string
      codeChallenge?: string
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
      const _claims = mergeDeepRight(defaultClaims, claims)

      return getAuthorizeUrl({
        state,
        nonce,
        scope,
        claims: _claims,
        codeChallenge,
      })
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
      codeChallenge,
    }: {
      userId?: string
      connectionId: string
      state?: string
      nonce?: string
      claims?: any
      expirationDateTime?: string
      transactionFromDateTime?: string
      enableAsync?: boolean
      codeChallenge?: string
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
      const _claims = mergeDeepRight(defaultClaims, claims)

      return getAuthorizeUrl({
        state,
        scope,
        nonce,
        claims: _claims,
        expirationDateTime,
        transactionFromDateTime,
        enableAsync,
        codeChallenge,
      })
    },

    getPaymentAuthorizeUrl: async ({
      bankId,
      payeeRef,
      payeeId,
      payee,
      payer,
      payeeType,
      amount,
      payerRef,
      payerId,
      payerType,
      state,
      nonce,
      context,
      readRefundAccount,
      userId,
      claims = {},
      codeChallenge,
    }: {
      bankId: string
      payeeRef: string
      payeeId?: string
      payeeType?: PaymentActorType
      amount: number
      payerRef: string
      payerId?: string
      payee?: RequestPayee
      payer?: RequestPayer
      payerType?: PayerType
      state?: string
      nonce?: string
      context?: string
      readRefundAccount?: boolean
      userId?: string
      claims?: any
      codeChallenge?: string
    }) => {
      if (!state) {
        console.error("State is required")
        throw new Error("Missing parameters")
      }

      if (!payeeId && !payee) {
        console.error("PayeeId or Payee are required")
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
              payee,
              payer,
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

      const _claims = mergeDeepRight(defaultClaims, claims)

      return getAuthorizeUrl({
        scope,
        state,
        claims: _claims,
        nonce,
        codeChallenge,
      })
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
      payer,
      codeChallenge,
    }: {
      bankId: string
      paymentId: string
      state?: string
      nonce?: string
      amount: number
      claims?: any
      payerId?: string
      payerType?: PayerType
      payer?: RequestPayer
      codeChallenge?: string
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
              payer,
              amount,
            },
          },
          "mh:payment": {
            essential: true,
          },
        },
      }

      const _claims = mergeDeepRight(defaultClaims, claims)

      return getAuthorizeUrl({
        scope,
        state,
        claims: _claims,
        nonce,
        codeChallenge,
      })
    },

    getRecurringPaymentAuthorizeUrl: async ({
      bankId,
      payeeId,
      payee,
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
      codeChallenge,
    }: {
      bankId: string
      payeeId?: string
      payee?: RequestPayee
      payeeType?: PaymentActorType
      payerId?: string
      payerType?: PayerType
      reference?: string
      validFromDate?: string
      validToDate?: string
      maximumIndividualAmount?: number
      currency?: string
      periodicLimits?: any
      type?: string
      context?: string
      state?: string
      nonce?: string
      userId: string
      claims?: any
      codeChallenge?: string
    }) => {
      if (!state) {
        console.error("State is required")
        throw new Error("Missing parameters")
      }

      if (!payeeId && !payee) {
        console.error("PayeeId or Payee are required")
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
              payee,
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

      const _claims = mergeDeepRight(defaultClaims, claims)

      return getAuthorizeUrl({
        scope,
        state,
        claims: _claims,
        nonce,
        codeChallenge,
      })
    },

    getStandingOrderAuthorizeUrl: async ({
      bankId,
      payeeId,
      payee,
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
      codeChallenge,
    }: {
      bankId: string
      payeeId?: string
      payee?: RequestPayee
      payeeType?: PaymentActorType
      payerId?: string
      payerType?: PayerType
      reference: string
      frequency: StandingOrderFrequency
      numberOfPayments?: number
      firstPaymentAmount: number
      recurringPaymentAmount: number
      finalPaymentAmount: number
      currency?: string
      firstPaymentDate: string
      recurringPaymentDate: string
      finalPaymentDate: string
      state?: string
      nonce?: string
      context: string
      claims?: any
      codeChallenge?: string
    }) => {
      if (!state) {
        console.error("State is required")
        throw new Error("Missing parameters")
      }

      if (!payeeId && !payee) {
        console.error("PayeeId or Payee are required")
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
              payee,
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

      const _claims = mergeDeepRight(defaultClaims, claims)

      return getAuthorizeUrl({
        scope,
        state,
        claims: _claims,
        nonce,
        codeChallenge,
      })
    },

    getPushedAuthorisationRequestUrl: async ({
      bankId,
      state,
      nonce,
      userId,
      claims = {},
      permissions,
      permissionsAction,
      expirationDateTime,
      transactionFromDateTime,
      enableAsync,
      codeChallenge,
    }: {
      bankId: string
      state?: string
      nonce?: string
      userId?: string
      context?: string
      claims?: any
      permissions?: string[]
      permissionsAction?: PermissionsAction
      expirationDateTime?: string
      transactionFromDateTime?: string
      enableAsync?: boolean
      codeChallenge?: string
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

      const _claims = compose(
        setPermissionsToClaims(permissions, permissionsAction),
        mergeDeepRight(defaultClaims),
      )(claims)

      return getAuthorizeUrl({
        scope,
        claims: _claims,
        codeChallenge,
        enableAsync,
        expirationDateTime,
        nonce,
        permissions,
        state,
        transactionFromDateTime,
      })
    },

  }
}
