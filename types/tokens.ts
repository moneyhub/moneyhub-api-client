import {Client, TokenSet} from "openid-client"
import type {ApiClientConfig} from "./config"

export interface TokensRequestsParams {
  client: Client
  config: ApiClientConfig
}

type ParamsFromCallback = Partial<{
  code: string
  id_token: string
  state: string
}>

type LocalParams = Partial<{
  state: string
  nonce: string
  sub: string
  max_age: number
  response_type: string
  code_verifier: string
}>

export interface TokensRequests {
  exchangeCodeForTokensLegacy: ({
    state,
    code,
    nonce,
    id_token,
  }: {
    state: string
    code: string
    nonce: string
    id_token: string
  }) => Promise<TokenSet>

  exchangeCodeForTokens: ({
    paramsFromCallback,
    localParams,
  }: {
    paramsFromCallback: ParamsFromCallback
    localParams: LocalParams
  }) => Promise<TokenSet>

  refreshTokens: ({
    refreshToken,
  }: {
    refreshToken: string
  }) => Promise<TokenSet>

  getClientCredentialTokens: ({
    scope,
    sub,
  }: {
    scope: string
    sub: string
  }) => Promise<TokenSet>
}
