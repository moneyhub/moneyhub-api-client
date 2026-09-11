/* eslint-disable complexity */
/* eslint-disable max-statements */
import {TokenSet} from "openid-client"
import type {Client} from "openid-client"
import * as R from "ramda"

import type {PkceExchangeOptions} from "./pkce"

const ALLOWED_PARAMS = [
  "access_token",
  "code",
  "error",
  "error_description",
  "error_uri",
  "expires_in",
  "id_token",
  "state",
  "token_type",
  "session_state",
] as const

export type ParamsFromCallback = {
  [K in typeof ALLOWED_PARAMS[number]]?: any
}

export interface LocalParams {
  max_age?: any
  state: any
  response_type?: any
  nonce?: any
  code_verifier?: any
  sub?: any
}

type ResponseType = "none" | "code" | "id_token" | "token"

const RESPONSE_TYPE_REQUIRED_PARAMS: {
  [K in ResponseType]: typeof ALLOWED_PARAMS[number][]
} = {
  none: [],
  code: ["code"],
  id_token: ["id_token"],
  token: ["access_token", "token_type"],
}

const runExchange = ({
  client,
  redirectUri,
  paramsFromCallback,
  localParams,
  checks,
}: {
  client: Client
  redirectUri: string
  paramsFromCallback: ParamsFromCallback
  localParams: LocalParams
  checks: LocalParams
}): Promise<TokenSet> => {
  const params = R.pick(ALLOWED_PARAMS, paramsFromCallback)

  if (client.default_max_age && !checks.max_age)
    checks.max_age = client.default_max_age

  if (!params.state && checks.state) {
    return Promise.reject(new Error("paramsFromCallback.state is missing"))
  }

  if (params.state && !checks.state) {
    return Promise.reject(new Error("localParams.state argument is missing"))
  }

  if (checks.state !== params.state) {
    return Promise.reject(new Error("state mismatch"))
  }

  if (params.error) {
    return Promise.reject(new Error(params.error))
  }

  if (!params.code) {
    return Promise.reject(new Error("paramsFromCallback.code is missing"))
  }

  if (checks.response_type) {
    for (const type of checks.response_type.split(" ") as ResponseType[]) {
      if (type === "none") {
        if (params.code || params.id_token || params.access_token) {
          return Promise.reject(
            new Error("unexpected params encountered for 'none' response"),
          )
        }
      } else {
        for (const param of RESPONSE_TYPE_REQUIRED_PARAMS[type]) {
          if (!params[param]) {
            return Promise.reject(new Error(`${param} missing from response`))
          }
        }
      }
    }
  }

  let promise

  if (params.id_token) {
    promise = Promise.resolve(new TokenSet(params))
      .then((tokenset) => (client as any).decryptIdToken(tokenset))
      .then<TokenSet>((tokenset) =>
        (client as any).validateIdToken(
          tokenset,
          checks.nonce,
          "authorization",
          checks.max_age,
          checks.state,
        ),
      )
  }

  if (params.code) {
    const grantCall = () =>
      client.grant({
        grant_type: "authorization_code",
        code: params.code,
        redirect_uri: redirectUri,
        code_verifier: checks.code_verifier,
        sub: localParams.sub,
      })
        .then((tokenset) => (client as any).decryptIdToken(tokenset))
        .then((tokenset) =>
          (client as any).validateIdToken(tokenset, checks.nonce, "token", checks.max_age),
        )
        .then((tokenset) => {
          if (params.session_state)
            tokenset.session_state = params.session_state
          return tokenset
        })

    if (promise) {
      promise = promise.then(grantCall)
    } else {
      return grantCall()
    }
  }

  return promise || Promise.resolve(new TokenSet(params))
}

export default ({
  client,
  redirectUri,
}: {
  client: Client
  redirectUri: string
}) => {
  const exchangeCodeForTokens = ({
    paramsFromCallback,
    localParams,
  }: {
    paramsFromCallback: ParamsFromCallback
    localParams: LocalParams
  }): Promise<TokenSet> =>
    runExchange({
      client,
      redirectUri,
      paramsFromCallback,
      localParams,
      checks: localParams,
    })

  const exchangeCodeForTokensUsingPKCE = async ({
    paramsFromCallback,
    localParams,
    pkce,
  }: {
    paramsFromCallback: ParamsFromCallback
    localParams: LocalParams
    pkce?: PkceExchangeOptions
  }): Promise<TokenSet> => {
    const checks = {...localParams}

    if (pkce?.consumeVerifier && checks.code_verifier) {
      return Promise.reject(
        new Error("Provide code_verifier via pkce.consumeVerifier or localParams.code_verifier, not both"),
      )
    }

    if (pkce?.consumeVerifier) {
      checks.code_verifier = await pkce.consumeVerifier({state: checks.state})
    }

    return runExchange({
      client,
      redirectUri,
      paramsFromCallback,
      localParams,
      checks,
    })
  }

  return {
    exchangeCodeForTokens,
    exchangeCodeForTokensUsingPKCE,
  }
}
