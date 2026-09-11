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

const createMockAuthClient = () => {
  const authParams: object[] = []
  const client = {
    issuer: {
      authorization_endpoint: "https://identity.example/oidc/auth",
    },
    requestObject: (params: object) => {
      authParams.push(params)
      return "signed-request"
    },
    pushedAuthorizationRequest: () =>
      Promise.resolve({request_uri: "urn:ietf:params:oauth:request_uri:test"}),
  }

  return {client, authParams}
}

describe("PKCE hooks", function() {
  describe("getAuthorizeUrlUsingPKCE", function() {
    it("omits pkce params when pkce is not provided", async function() {
      const {client, authParams} = createMockAuthClient()
      const {getAuthorizeUrlUsingPKCE} = getAuthUrlsFactory({client: client as any, config: baseConfig})

      const url = await getAuthorizeUrlUsingPKCE({
        state: "sample-state",
        scope: "openid",
      })

      expect(url).to.be.a("string")
      expect(authParams[0]).to.not.have.property("code_challenge")
    })

    it("does not generate pkce when pkce.generate is omitted", async function() {
      const {client, authParams} = createMockAuthClient()
      const {getAuthorizeUrlUsingPKCE} = getAuthUrlsFactory({client: client as any, config: baseConfig})

      await getAuthorizeUrlUsingPKCE({
        state: "sample-state",
        scope: "openid",
        pkce: {},
      })

      expect(authParams[0]).to.not.have.property("code_challenge")
    })

    it("stores verifier and includes code_challenge when pkce.generate is true", async function() {
      const {client, authParams} = createMockAuthClient()
      const {getAuthorizeUrlUsingPKCE} = getAuthUrlsFactory({client: client as any, config: baseConfig})
      const stored: {state?: string, codeVerifier?: string} = {}

      await getAuthorizeUrlUsingPKCE({
        state: "sample-state",
        scope: "openid",
        pkce: {
          generate: true,
          storeVerifier: async ({state, codeVerifier}) => {
            stored.state = state
            stored.codeVerifier = codeVerifier
          },
        },
      })

      expect(stored.state).to.equal("sample-state")
      expect(stored.codeVerifier).to.be.a("string")
      expect(authParams[0]).to.include({
        code_challenge: generators.codeChallenge(stored.codeVerifier as string),
        code_challenge_method: "S256",
      })
    })

    it("throws when pkce.generate and codeChallenge are both provided", async function() {
      const {client} = createMockAuthClient()
      const {getAuthorizeUrlUsingPKCE} = getAuthUrlsFactory({client: client as any, config: baseConfig})

      try {
        await getAuthorizeUrlUsingPKCE({
          state: "sample-state",
          scope: "openid",
          codeChallenge: "challenge",
          pkce: {
            generate: true,
            storeVerifier: async () => undefined,
          },
        })
        expect.fail("expected error")
      } catch (error) {
        expect((error as Error).message).to.equal("Provide either pkce.generate or codeChallenge, not both")
      }
    })

    it("throws when pkce.generate is true without storeVerifier", async function() {
      const {client} = createMockAuthClient()
      const {getAuthorizeUrlUsingPKCE} = getAuthUrlsFactory({client: client as any, config: baseConfig})

      try {
        await getAuthorizeUrlUsingPKCE({
          state: "sample-state",
          scope: "openid",
          pkce: {generate: true},
        })
        expect.fail("expected error")
      } catch (error) {
        expect((error as Error).message).to.equal("pkce.storeVerifier is required when pkce.generate is true")
      }
    })

    it("throws when pkce.generate is true without state", async function() {
      const {client} = createMockAuthClient()
      const {getAuthorizeUrlUsingPKCE} = getAuthUrlsFactory({client: client as any, config: baseConfig})

      try {
        await getAuthorizeUrlUsingPKCE({
          scope: "openid",
          pkce: {
            generate: true,
            storeVerifier: async () => undefined,
          },
        })
        expect.fail("expected error")
      } catch (error) {
        expect((error as Error).message).to.equal("state is required when pkce.generate is true")
      }
    })
  })

  describe("exchangeCodeForTokens", function() {
    const state = "sample-state"
    const code = "auth-code"

    const createExchangeClient = (grantStub: (...args: any[]) => Promise<any>) => ({
      default_max_age: undefined,
      grant: grantStub,
      decryptIdToken: (tokenset: any) => tokenset,
      validateIdToken: (tokenset: any) => tokenset,
    })

    it("uses pkce.consumeVerifier for code_verifier", async function() {
      let consumedState: string | undefined
      const grantStub = async (params: {code_verifier?: string}) => {
        expect(params.code_verifier).to.equal("stored-verifier")
        return {access_token: "token"}
      }

      const exchange = exchangeCodeForTokensFactory({
        client: createExchangeClient(grantStub) as any,
        redirectUri: baseConfig.client.redirect_uri as string,
      })

      await exchange({
        paramsFromCallback: {code, state},
        localParams: {state, response_type: "code"},
        pkce: {
          consumeVerifier: async ({state: oauthState}) => {
            consumedState = oauthState
            return "stored-verifier"
          },
        },
      })

      expect(consumedState).to.equal(state)
    })

    it("falls back to localParams.code_verifier when pkce is omitted", async function() {
      const grantStub = async (params: {code_verifier?: string}) => {
        expect(params.code_verifier).to.equal("manual-verifier")
        return {access_token: "token"}
      }

      const exchange = exchangeCodeForTokensFactory({
        client: createExchangeClient(grantStub) as any,
        redirectUri: baseConfig.client.redirect_uri as string,
      })

      await exchange({
        paramsFromCallback: {code, state},
        localParams: {
          state,
          response_type: "code",
          code_verifier: "manual-verifier",
        },
      })
    })

    it("throws when pkce.consumeVerifier and localParams.code_verifier are both set", async function() {
      const exchange = exchangeCodeForTokensFactory({
        client: createExchangeClient(async () => ({access_token: "token"})) as any,
        redirectUri: baseConfig.client.redirect_uri as string,
      })

      try {
        await exchange({
          paramsFromCallback: {code, state},
          localParams: {
            state,
            response_type: "code",
            code_verifier: "manual-verifier",
          },
          pkce: {
            consumeVerifier: async () => "stored-verifier",
          },
        })
        expect.fail("expected error")
      } catch (error) {
        expect((error as Error).message).to.equal(
          "Provide code_verifier via pkce.consumeVerifier or localParams.code_verifier, not both",
        )
      }
    })
  })
})
