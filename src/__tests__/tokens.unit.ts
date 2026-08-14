import {expect} from "chai"
import tokensFactory from "../tokens"

describe("tokens factory (unit)", function() {
  const baseConfig = {
    identityServiceUrl: "https://identity.example.com",
    resourceServerUrl: "https://api.example.com",
    client: {
      client_id: "client-1",
      redirect_uri: "https://app.example.com/cb",
      request_object_signing_alg: "RS256" as const,
      keys: [
        {alg: "RS256", kty: "RSA", kid: "k1", n: "n", e: "e", d: "d", p: "p", q: "q", dp: "dp", dq: "dq", qi: "qi"},
      ],
    },
  }

  it("should throw when exchangeCodeForTokens called without paramsFromCallback", function() {
    const client = {}
    const tokens = tokensFactory({client: client as any, config: baseConfig as any})
    expect(() => tokens.exchangeCodeForTokens({localParams: {state: "s"}} as any)).to.throw(/Missing Parameters/)
  })

  it("should throw when exchangeCodeForTokens called without localParams", function() {
    const client = {}
    const tokens = tokensFactory({client: client as any, config: baseConfig as any})
    expect(() => tokens.exchangeCodeForTokens({paramsFromCallback: {}} as any)).to.throw(/Missing Parameters/)
  })

  it("should call client.authorizationCallback in exchangeCodeForTokensLegacy", async function() {
    const tokenSet = {access_token: "at"}
    const client = {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- mock callback, third param not needed
      authorizationCallback: (_uri: string, params: any, _verify: any) => {
        expect(params).to.include({state: "st", code: "c", nonce: "n"})
        return Promise.resolve(tokenSet)
      },
    }
    const tokens = tokensFactory({client: client as any, config: baseConfig as any})
    const result = await tokens.exchangeCodeForTokensLegacy({state: "st", code: "c", nonce: "n"})
    expect(result).to.deep.equal(tokenSet)
  })

  it("should call client.refresh in refreshTokens", async function() {
    const tokenSet = {access_token: "at"}
    const client = {refresh: (rt: string) => Promise.resolve(rt === "refresh-tok" ? tokenSet : ({} as any))}
    const tokens = tokensFactory({client: client as any, config: baseConfig as any})
    const result = await tokens.refreshTokens({refreshToken: "refresh-tok"})
    expect(result).to.deep.equal(tokenSet)
  })

  it("should call client.grant with client_credentials in getClientCredentialTokens", async function() {
    const tokenSet = {access_token: "at"}
    const client = {
      grant: (opts: any) => {
        expect(opts.grant_type).to.equal("client_credentials")
        expect(opts.scope).to.equal("accounts:read")
        expect(opts.sub).to.equal("user-1")
        return Promise.resolve(tokenSet)
      },
    }
    const tokens = tokensFactory({client: client as any, config: baseConfig as any})
    const result = await tokens.getClientCredentialTokens({scope: "accounts:read", sub: "user-1"})
    expect(result).to.deep.equal(tokenSet)
  })

  it("should throw when createJWTBearerGrantToken is called with request_object_signing_alg 'none'", async function() {
    const config = {...baseConfig, client: {...baseConfig.client, request_object_signing_alg: "none" as any}}
    const tokens = tokensFactory({client: {} as any, config: config as any})
    try {
      await tokens.createJWTBearerGrantToken("sub")
      expect.fail("should have thrown")
    } catch (e: any) {
      expect(e.message).to.equal("request_object_signing_alg can't be 'none'")
    }
  })

  it("should throw when createJWTBearerGrantToken is called but no matching key", async function() {
    const config = {
      ...baseConfig,
      client: {...baseConfig.client, request_object_signing_alg: "ES256" as const, keys: [{alg: "RS256", kty: "RSA"}]},
    }
    const tokens = tokensFactory({client: {} as any, config: config as any})
    try {
      await tokens.createJWTBearerGrantToken("sub")
      expect.fail("should have thrown")
    } catch (e: any) {
      expect(e.message).to.match(/Private key with alg ES256 missing/)
    }
  })
})
