/* eslint-disable max-nested-callbacks */
import {expect} from "chai"
import {generators} from "openid-client"

import getAuthUrlsFactory from "../get-auth-urls"
import exchangeCodeForTokensFactory from "../exchange-code-for-token"
import type {ApiClientConfig} from "../schema/config"

const baseConfig = {
  resourceServerUrl: "https://api.example/v2.0",
  identityServiceUrl: "https://identity.example/oidc",
  client: {
    client_id: "test-client",
    redirect_uri: "https://app.example/callback",
    response_type: "code",
    token_endpoint_auth_method: "private_key_jwt",
    id_token_signed_response_alg: "RS256",
    request_object_signing_alg: "none",
    keys: [],
  },
} as ApiClientConfig

const state = "sample-state"
const code = "auth-code"
const scopeOpts = {state, scope: "openid"}

const authUrls = () => {
  const authParams: object[] = []
  const client = {
    issuer: {authorization_endpoint: "https://identity.example/oidc/auth"},
    requestObject: (params: object) => {
      authParams.push(params)
      return "signed-request"
    },
    pushedAuthorizationRequest: () =>
      Promise.resolve({request_uri: "urn:ietf:params:oauth:request_uri:test"}),
  }
  return {
    authParams,
    ...getAuthUrlsFactory({client: client as any, config: baseConfig}),
  }
}

const exchange = (grant: (...args: any[]) => Promise<any>) =>
  exchangeCodeForTokensFactory({
    client: {
      default_max_age: undefined,
      grant,
      decryptIdToken: (tokenset: any) => tokenset,
      validateIdToken: (tokenset: any) => tokenset,
    } as any,
    redirectUri: baseConfig.client.redirect_uri as string,
  })

const expectReject = async (run: () => Promise<unknown>, message: string) => {
  try {
    await run()
    expect.fail("expected error")
  } catch (error) {
    expect((error as Error).message).to.equal(message)
  }
}

describe("PKCE hooks", function() {
  describe("getAuthorizeUrlUsingPKCE", function() {
    it("omits code_challenge when pkce is absent or generate is omitted", async function() {
      for (const pkce of [undefined, {}]) {
        const {authParams, getAuthorizeUrlUsingPKCE} = authUrls()
        await getAuthorizeUrlUsingPKCE({...scopeOpts, ...(pkce ? {pkce} : {})})
        expect(authParams[0]).to.not.have.property("code_challenge")
      }
    })

    it("stores verifier and includes code_challenge when pkce.generate is true", async function() {
      const {authParams, getAuthorizeUrlUsingPKCE} = authUrls()
      const stored: {state?: string, codeVerifier?: string} = {}

      await getAuthorizeUrlUsingPKCE({
        ...scopeOpts,
        pkce: {
          generate: true,
          storeVerifier: async ({state: oauthState, codeVerifier}) => {
            stored.state = oauthState
            stored.codeVerifier = codeVerifier
          },
        },
      })

      expect(stored).to.include({state: "sample-state"})
      expect(stored.codeVerifier).to.be.a("string")
      expect(authParams[0]).to.include({
        code_challenge: generators.codeChallenge(stored.codeVerifier as string),
        code_challenge_method: "S256",
      })
    })

    it("rejects invalid pkce.generate usage", async function() {
      const {getAuthorizeUrlUsingPKCE} = authUrls()
      const storeVerifier = async () => undefined

      await expectReject(
        () => getAuthorizeUrlUsingPKCE({
          ...scopeOpts,
          codeChallenge: "challenge",
          pkce: {generate: true, storeVerifier},
        }),
        "Provide either pkce.generate or codeChallenge, not both",
      )
      await expectReject(
        () => getAuthorizeUrlUsingPKCE({...scopeOpts, pkce: {generate: true}}),
        "pkce.storeVerifier is required when pkce.generate is true",
      )
      await expectReject(
        () => getAuthorizeUrlUsingPKCE({scope: "openid", pkce: {generate: true, storeVerifier}}),
        "state is required when pkce.generate is true",
      )
    })
  })

  describe("exchangeCodeForTokensUsingPKCE", function() {
    const callback = {paramsFromCallback: {code, state}, localParams: {state, response_type: "code"}}

    it("passes code_verifier from consumeVerifier or localParams", async function() {
      let consumedState: string | undefined
      const grant = async (params: {code_verifier?: string}) => {
        expect(params.code_verifier).to.equal("stored-verifier")
        return {access_token: "token"}
      }

      await exchange(grant).exchangeCodeForTokensUsingPKCE({
        ...callback,
        pkce: {consumeVerifier: async ({state: oauthState}) => {
          consumedState = oauthState
          return "stored-verifier"
        }},
      })
      expect(consumedState).to.equal(state)

      await exchange(async (params) => {
        expect(params.code_verifier).to.equal("manual-verifier")
        return {access_token: "token"}
      }).exchangeCodeForTokens({
        ...callback,
        localParams: {...callback.localParams, code_verifier: "manual-verifier"},
      })
    })

    it("rejects code_verifier from both consumeVerifier and localParams", async function() {
      await expectReject(
        () => exchange(async () => ({access_token: "token"})).exchangeCodeForTokensUsingPKCE({
          ...callback,
          localParams: {...callback.localParams, code_verifier: "manual-verifier"},
          pkce: {consumeVerifier: async () => "stored-verifier"},
        }),
        "Provide code_verifier via pkce.consumeVerifier or localParams.code_verifier, not both",
      )
    })
  })
})
