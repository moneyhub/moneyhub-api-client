import {expect} from "chai"
import {
  rewriteUrlsInObject,
  rewriteDiscoveryUrls,
  rewriteDiscoveryDocForIdentityUrl,
  inferCanonicalBaseFromLinkUrl,
  rewriteResourceServerResponseUrls,
} from "../discovery"
import {createGetOpenIdConfig} from "../oidc-config"
import type {Request} from "../request"
import unauthenticated from "../requests/unauthenticated"

describe("discovery URL rewrite", function() {
  describe("rewriteUrlsInObject", function() {
    const canonical = "https://identity.moneyhub.co.uk/oidc"
    const target = "https://gateway.example.com/identity/oidc"

    it("rewrites a string that starts with canonical base", function() {
      const url = canonical + "/authorize"
      expect(rewriteUrlsInObject(url, canonical, target)).to.equal(target + "/authorize")
    })

    it("leaves a string that does not start with canonical base unchanged", function() {
      expect(rewriteUrlsInObject("https://other.com/path", canonical, target)).to.equal("https://other.com/path")
    })

    it("returns value unchanged when canonical base equals target base", function() {
      const url = canonical + "/token"
      expect(rewriteUrlsInObject(url, canonical, canonical)).to.equal(url)
    })

    it("rewrites URLs in a nested object", function() {
      const obj = {
        authorization_endpoint: canonical + "/authorize",
        token_endpoint: canonical + "/token",
      }
      const out = rewriteUrlsInObject(obj, canonical, target)
      expect(out).to.eql({
        authorization_endpoint: target + "/authorize",
        token_endpoint: target + "/token",
      })
    })

    it("rewrites URLs in an array", function() {
      const arr = [canonical + "/a", canonical + "/b"]
      const out = rewriteUrlsInObject(arr, canonical, target)
      expect(out).to.eql([target + "/a", target + "/b"])
    })

    it("leaves non-string primitives unchanged", function() {
      expect(rewriteUrlsInObject(42, canonical, target)).to.equal(42)
      expect(rewriteUrlsInObject(null, canonical, target)).to.equal(null)
    })
  })

  describe("rewriteDiscoveryUrls", function() {
    const canonical = "https://identity.moneyhub.co.uk/oidc"
    const target = "https://gateway.example.com/oidc"

    it("rewrites endpoint URLs but leaves issuer unchanged", function() {
      const doc = {
        issuer: canonical,
        authorization_endpoint: canonical + "/authorize",
        token_endpoint: canonical + "/token",
        jwks_uri: canonical + "/.well-known/jwks.json",
      }
      const out = rewriteDiscoveryUrls(doc, canonical, target)
      expect(out.issuer).to.equal(canonical)
      expect(out.authorization_endpoint).to.equal(target + "/authorize")
      expect(out.token_endpoint).to.equal(target + "/token")
      expect(out.jwks_uri).to.equal(target + "/.well-known/jwks.json")
    })

    it("returns document unchanged when canonical equals target", function() {
      const doc = {issuer: canonical, authorization_endpoint: canonical + "/authorize"}
      const out = rewriteDiscoveryUrls(doc, canonical, canonical)
      expect(out).to.eql(doc)
    })
  })

  describe("inferCanonicalBaseFromLinkUrl", function() {
    it("extracts origin and path up to and including version segment", function() {
      const url = "https://api.moneyhub.co.uk/v3/accounts/123"
      expect(inferCanonicalBaseFromLinkUrl(url)).to.equal("https://api.moneyhub.co.uk/v3")
    })

    it("returns origin only when path has no version segment", function() {
      const url = "https://api.example.com/accounts"
      expect(inferCanonicalBaseFromLinkUrl(url)).to.equal("https://api.example.com")
    })

    it("returns null for invalid URL", function() {
      expect(inferCanonicalBaseFromLinkUrl("not-a-url")).to.equal(null)
    })
  })

  describe("rewriteResourceServerResponseUrls", function() {
    const resourceServerUrl = "https://gateway.example.com/v3"

    it("rewrites links when response contains canonical base", function() {
      const body = {
        data: [{id: "1"}],
        links: {
          self: "https://api.moneyhub.co.uk/v3/accounts",
          next: "https://api.moneyhub.co.uk/v3/accounts?offset=10",
        },
      }
      const out = rewriteResourceServerResponseUrls(body, resourceServerUrl)
      expect((out as typeof body).links?.self).to.equal("https://gateway.example.com/v3/accounts")
      expect((out as typeof body).links?.next).to.equal("https://gateway.example.com/v3/accounts?offset=10")
    })

    it("returns body unchanged when no links", function() {
      const body = {data: []}
      expect(rewriteResourceServerResponseUrls(body, resourceServerUrl)).to.eql(body)
    })

    it("returns body unchanged when links.self already uses resourceServerUrl base", function() {
      const body = {
        links: {
          self: "https://gateway.example.com/v3/accounts",
        },
      }
      expect(rewriteResourceServerResponseUrls(body, resourceServerUrl)).to.eql(body)
    })

    it("returns body unchanged for non-object", function() {
      expect(rewriteResourceServerResponseUrls(null, resourceServerUrl)).to.equal(null)
    })

    it("rewrites all link URLs when no version segment (canonical base is origin only)", function() {
      const body = {
        data: [],
        links: {
          self: "https://api.example.com/accounts/123",
          next: "https://api.example.com/transactions?offset=10",
        },
      }
      const out = rewriteResourceServerResponseUrls(body, resourceServerUrl)
      expect((out as typeof body).links?.self).to.equal("https://gateway.example.com/v3/accounts/123")
      expect((out as typeof body).links?.next).to.equal("https://gateway.example.com/v3/transactions?offset=10")
    })

    it("rewrites only links and leaves data and meta unchanged", function() {
      const canonicalUrlInData = "https://api.moneyhub.co.uk/v3/accounts/123"
      const body = {
        data: [{id: "1", href: canonicalUrlInData}],
        meta: {source: canonicalUrlInData},
        links: {
          self: "https://api.moneyhub.co.uk/v3/accounts",
          next: "https://api.moneyhub.co.uk/v3/accounts?offset=10",
        },
      }
      const out = rewriteResourceServerResponseUrls(body, resourceServerUrl)
      expect((out as typeof body).links?.self).to.equal("https://gateway.example.com/v3/accounts")
      expect((out as typeof body).links?.next).to.equal("https://gateway.example.com/v3/accounts?offset=10")
      expect((out as typeof body).data).to.eql(body.data)
      expect((out as typeof body).meta).to.eql(body.meta)
    })
  })

  describe("rewriteDiscoveryDocForIdentityUrl", function() {
    const canonical = "https://identity.moneyhub.co.uk/oidc"
    const gatewayBase = "https://gateway.example.com/identity/oidc"
    const rawDoc = {
      issuer: canonical,
      authorization_endpoint: canonical + "/authorize",
      token_endpoint: canonical + "/token",
      jwks_uri: canonical + "/.well-known/jwks.json",
    }

    it("rewrites discovery doc for identity URL so gateway URLs are used", function() {
      const rewritten = rewriteDiscoveryDocForIdentityUrl(gatewayBase.replace("/oidc", ""), rawDoc)
      expect(rewritten.issuer).to.equal(canonical)
      expect(rewritten.authorization_endpoint).to.equal(gatewayBase + "/authorize")
      expect(rewritten.token_endpoint).to.equal(gatewayBase + "/token")
      expect(rewritten.jwks_uri).to.equal(gatewayBase + "/.well-known/jwks.json")
    })
  })

  describe("getOpenIdConfig via createGetOpenIdConfig (TTLCache)", function() {
    const canonical = "https://identity.moneyhub.co.uk/oidc"
    const gatewayBase = "https://gateway.example.com/identity/oidc"
    const rawDoc = {
      issuer: canonical,
      authorization_endpoint: canonical + "/authorize",
      token_endpoint: canonical + "/token",
      jwks_uri: canonical + "/.well-known/jwks.json",
    }

    it("returns rewritten discovery when enableGatewayUrlRewriting is true and applies TTL cache", async function() {
      const request: Request = async () => rawDoc as any
      const getOpenIdConfig = createGetOpenIdConfig({
        identityServiceUrl: gatewayBase.replace("/oidc", ""),
        enableGatewayUrlRewriting: true,
        openIdConfigCacheTtlMs: 3600000,
        request,
      })
      const result = (await getOpenIdConfig()) as Record<string, unknown>
      expect(result.issuer).to.equal(canonical)
      expect(result.authorization_endpoint).to.equal(gatewayBase + "/authorize")
      expect(result.token_endpoint).to.equal(gatewayBase + "/token")
      expect(result.jwks_uri).to.equal(gatewayBase + "/.well-known/jwks.json")
      const cached = await getOpenIdConfig()
      expect(cached).to.eql(result)
    })

    it("getOpenIdConfig is delegated from unauthenticated", async function() {
      const request: Request = async () => rawDoc as any
      const getOpenIdConfig = createGetOpenIdConfig({
        identityServiceUrl: gatewayBase.replace("/oidc", ""),
        enableGatewayUrlRewriting: true,
        openIdConfigCacheTtlMs: 0,
        request,
      })
      const config = {
        resourceServerUrl: "https://gateway.example.com/v3",
        identityServiceUrl: gatewayBase.replace("/oidc", ""),
        getOpenIdConfig,
        client: {client_id: "test", client_secret: "secret"},
      } as any
      const api = unauthenticated({config, request})
      const result = (await api.getOpenIdConfig()) as Record<string, unknown>
      expect(result.authorization_endpoint).to.equal(gatewayBase + "/authorize")
    })
  })
})
