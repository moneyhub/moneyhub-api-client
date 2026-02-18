/* eslint-disable max-nested-callbacks */
import {expect} from "chai"
import {Moneyhub, MoneyhubInstance} from ".."

const {startProxyServer} = require("../../test/gateway-rewrite/proxy-server")

describe("Gateway URL rewriting (integration)", function() {
  let gatewayConfig: Record<string, unknown>
  let moneyhub: MoneyhubInstance
  let proxy: {server: import("http").Server; port: number; stop: () => Promise<void>}

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
    const escaped = gatewayIdentityBase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    expect(openIdConfig.authorization_endpoint).to.match(new RegExp(`^${escaped}/`))
    expect(openIdConfig.token_endpoint).to.match(new RegExp(`^${escaped}/`))
    expect(openIdConfig.jwks_uri).to.match(new RegExp(`^${escaped}/`))
  })

  it("rewrites resource server response links to gateway base", async function() {
    const userId = this.config.testUserId as string
    const accounts = await moneyhub.getAccounts({userId})

    expect(accounts.data).to.be.an("array")
    expect(accounts.links).to.exist
    expect(accounts.links?.self).to.exist
    expect(accounts.links!.self).to.match(
      new RegExp(`^http://127\\.0\\.0\\.1:${proxy.port}/moneyhub/resource-server/v3/accounts`),
      "links.self should use the gateway base URL",
    )
    if (accounts.links?.next) {
      expect(accounts.links.next).to.match(
        new RegExp(`^http://127\\.0\\.0\\.1:${proxy.port}/moneyhub/resource-server/v3/accounts?offset`),
        "links.next should use the gateway base URL",
      )
    }
  })
})
