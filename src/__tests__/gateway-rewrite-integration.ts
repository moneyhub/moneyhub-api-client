/* eslint-disable max-nested-callbacks */
import {expect} from "chai"
import {Moneyhub, MoneyhubInstance} from ".."
// Proxy server lives under test/ (outside rootDir); load at runtime to avoid TS resolution error.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const {startProxyServer} = require("../../test/gateway-rewrite/proxy-server")

describe("Gateway URL rewriting (integration)", function() {
  let gatewayConfig: Record<string, unknown>
  let moneyhub: MoneyhubInstance
  let proxy: {server: import("http").Server, port: number, stop: () => Promise<void>}

  before(async function() {
    if (this.config?.mode !== "TEST") {
      throw new Error("These tests require example config to be set to test mode")
    }

    const realIdentityServiceUrl = this.config.identityServiceUrl as string
    const realResourceServerUrl = this.config.resourceServerUrl as string

    proxy = await startProxyServer({
      realIdentityServiceUrl,
      realResourceServerUrl,
    })

    const gatewayBase = `http://127.0.0.1:${proxy.port}`

    gatewayConfig = {
      ...this.config,
      resourceServerUrl: `${gatewayBase}/moneyhub/resource-server/v3`,
      identityServiceUrl: `${gatewayBase}/moneyhub/identity-service`,
      options: {
        ...(this.config.options || {}),
        enableGatewayUrlRewriting: true,
      },
    }

    moneyhub = await Moneyhub(gatewayConfig as any)
  })

  after(async function() {
    if (proxy?.stop) {
      await proxy.stop()
    }
  })

  it("returns discovery with gateway URLs when enableGatewayUrlRewriting is true", async function() {
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
})
