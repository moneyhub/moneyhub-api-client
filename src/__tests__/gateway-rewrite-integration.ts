
import {expect} from "chai"
import {Moneyhub, MoneyhubInstance} from ".."
// Proxy server lives under test/ (outside rootDir); load at runtime to avoid TS resolution error.

const {startProxyServer} = require("../../test/gateway-rewrite/proxy-server")

describe("Gateway URL rewriting (integration)", function() {
  let gatewayConfig: Record<string, unknown>
  let moneyhub: MoneyhubInstance
  let moneyhubNoRewrite: MoneyhubInstance
  let proxy: {server: import("http").Server, port: number, stop: () => Promise<void>}
  let realIdentityServiceUrl: string
  let realResourceServerUrl: string

  before(async function() {
    if (this.config?.mode !== "TEST") {
      throw new Error("These tests require example config to be set to test mode")
    }

    realIdentityServiceUrl = this.config.identityServiceUrl as string
    realResourceServerUrl = this.config.resourceServerUrl as string

    proxy = await startProxyServer({
      realIdentityServiceUrl,
      realResourceServerUrl,
    })

    const gatewayBase = `http://127.0.0.1:${proxy.port}`

    gatewayConfig = {
      ...this.config,
      resourceServerUrl: realResourceServerUrl,
      identityServiceUrl: realIdentityServiceUrl,
      gatewayResourceServerUrl: `${gatewayBase}/moneyhub/resource-server/v3`,
      gatewayIdentityServiceUrl: `${gatewayBase}/moneyhub/identity-service`,
      options: this.config.options || {},
    }

    moneyhub = await Moneyhub(gatewayConfig as any)

    const configNoRewrite = {
      ...this.config,
      resourceServerUrl: realResourceServerUrl,
      identityServiceUrl: realIdentityServiceUrl,
      options: this.config.options || {},
    }
    moneyhubNoRewrite = await Moneyhub(configNoRewrite as any)
  })

  after(async function() {
    if (proxy?.stop) {
      await proxy.stop()
    }
  })

  it("returns discovery with gateway URLs when identity is configured with gateway URL", async function() {
    const openIdConfig = (await moneyhub.getOpenIdConfig()) as Record<string, unknown>

    expect(openIdConfig.issuer).to.be.a("string")
    const issuer = openIdConfig.issuer as string
    expect(issuer).to.match(/^https:\/\//, "issuer should remain the canonical identity URL")

    const gatewayIdentityBase = `http://127.0.0.1:${proxy.port}/moneyhub/identity-service`
    expect(String(openIdConfig.authorization_endpoint)).to.satisfy(
      (s: string) => s.startsWith(gatewayIdentityBase),
      "authorization_endpoint should use the gateway base URL",
    )
    expect(String(openIdConfig.token_endpoint)).to.satisfy(
      (s: string) => s.startsWith(gatewayIdentityBase),
      "token_endpoint should use the gateway base URL",
    )
    expect(String(openIdConfig.jwks_uri)).to.satisfy(
      (s: string) => s.startsWith(gatewayIdentityBase),
      "jwks_uri should use the gateway base URL",
    )
  })

  it("rewrites resource server response links to gateway base", async function() {
    const userId = this.config.testUserId as string
    const accounts = await moneyhub.getAccounts({userId})

    expect(accounts.data).to.be.an("array")
    expect(accounts.links).to.exist
    const selfLink = accounts.links?.self
    expect(selfLink).to.exist
    const gatewayApiBase = `http://127.0.0.1:${proxy.port}/moneyhub/resource-server/v3/`
    expect(selfLink as string).to.satisfy(
      (s: string) => s.startsWith(gatewayApiBase),
      "links.self should use the gateway base URL",
    )
    const nextLink = accounts.links?.next
    if (nextLink) {
      expect(nextLink).to.satisfy(
        (s: string) => s.startsWith(gatewayApiBase),
        "links.next should use the gateway base URL",
      )
    }
  })

  it("returns discovery with canonical URLs when identity is configured with canonical URL", async function() {
    const openIdConfig = (await moneyhubNoRewrite.getOpenIdConfig()) as Record<string, unknown>
    const canonicalIdentityBase = realIdentityServiceUrl.replace(/\/$/, "")
    expect(String(openIdConfig.authorization_endpoint)).to.satisfy(
      (s: string) => s.startsWith(canonicalIdentityBase),
      "authorization_endpoint should use the configured (canonical) identity URL",
    )
    expect(String(openIdConfig.token_endpoint)).to.satisfy(
      (s: string) => s.startsWith(canonicalIdentityBase),
      "token_endpoint should use the configured (canonical) identity URL",
    )
  })

  it("returns resource server links with canonical base when resource server is configured with canonical URL", async function() {
    const userId = this.config.testUserId as string
    const accounts = await moneyhubNoRewrite.getAccounts({userId})
    expect(accounts.data).to.be.an("array")
    const selfLink = accounts.links?.self
    expect(selfLink).to.exist
    const configuredOrigin = new URL(realResourceServerUrl.replace(/\/$/, "")).origin
    const linkOrigin = new URL(selfLink as string).origin
    expect(linkOrigin).to.equal(
      configuredOrigin,
      "links.self should use the same origin as the configured (canonical) resource server URL (API may return a different version segment e.g. /v2 vs /v3)",
    )
  })
})
