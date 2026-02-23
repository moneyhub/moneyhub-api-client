import {expect} from "chai"
import {
  rewriteUrlsInObject,
  rewriteDiscoveryUrls,
  rewriteDiscoveryDocForIdentityUrl,
  inferCanonicalBaseFromLinkUrl,
  rewriteResourceServerResponseUrls,
} from "../discovery"

const proxyquire = require("proxyquire").noCallThru()

describe("discovery (unit)", function() {
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

    it("returns doc unchanged when issuer is missing", function() {
      const doc = {authorization_endpoint: "https://a.com/auth"}
      expect(rewriteDiscoveryDocForIdentityUrl("https://gateway.com/oidc", doc)).to.eql(doc)
    })

    it("returns doc unchanged when issuer is not a string", function() {
      const doc = {issuer: 123}
      expect(rewriteDiscoveryDocForIdentityUrl("https://gateway.com/oidc", doc)).to.eql(doc)
    })
  })

  describe("inferCanonicalBaseFromLinkUrl", function() {
    it("extracts origin and path up to and including version segment", function() {
      const url = "https://api.moneyhub.co.uk/v3/accounts/123"
      expect(inferCanonicalBaseFromLinkUrl(url)).to.equal("https://api.moneyhub.co.uk/v3")
    })

    it("handles version with minor (v3.0)", function() {
      const url = "https://api.example.com/v3.0/accounts"
      expect(inferCanonicalBaseFromLinkUrl(url)).to.equal("https://api.example.com/v3.0")
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

    it("returns body unchanged when links.self is not a string", function() {
      const body = {links: {self: 123}}
      expect(rewriteResourceServerResponseUrls(body, resourceServerUrl)).to.eql(body)
    })

    it("returns body unchanged for non-object", function() {
      expect(rewriteResourceServerResponseUrls(null, resourceServerUrl)).to.equal(null)
    })

    it("returns body unchanged when canonical equals target base", function() {
      const body = {
        links: {self: "https://gateway.example.com/v3/accounts"},
      }
      expect(rewriteResourceServerResponseUrls(body, resourceServerUrl)).to.eql(body)
    })
  })

  describe("getDiscovery", function() {
    it("fetches discovery from identity URL and returns metadata", async function() {
      const rawDoc = {
        issuer: "https://identity.example.com/oidc",
        authorization_endpoint: "https://identity.example.com/oidc/authorize",
        token_endpoint: "https://identity.example.com/oidc/token",
      }
      const mockGot = Object.assign(
        (_url: string) => {
          expect(_url).to.equal("https://identity.example.com/oidc/.well-known/openid-configuration")
          return {json: () => Promise.resolve(rawDoc)}
        },
        {get: () => ({json: () => Promise.resolve(rawDoc)})},
      )
      const discovery = proxyquire("../discovery", {got: mockGot})
      const result = await discovery.getDiscovery("https://identity.example.com")
      expect(result).to.eql(rawDoc)
    })

    it("passes timeout and agent when provided", async function() {
      let capturedOpts: any
      const mockGot = (_url: string, opts: any) => {
        capturedOpts = opts
        return {json: () => Promise.resolve({issuer: "https://id.example.com/oidc"})}
      }
      const discovery = proxyquire("../discovery", {got: mockGot})
      await discovery.getDiscovery("https://identity.example.com", {timeout: 5000, agent: {http: {} as any}})
      expect(capturedOpts.timeout).to.equal(5000)
      expect(capturedOpts.agent).to.exist
    })

    it("passes mTLS cert and key when provided", async function() {
      let capturedOpts: any
      const mockGot = (_url: string, opts: any) => {
        capturedOpts = opts
        return {json: () => Promise.resolve({issuer: "https://id.example.com/oidc"})}
      }
      const discovery = proxyquire("../discovery", {got: mockGot})
      await discovery.getDiscovery("https://identity.example.com", {
        mTLS: {cert: "cert-pem", key: "key-pem"},
      })
      expect(capturedOpts.https?.certificate).to.equal("cert-pem")
      expect(capturedOpts.https?.key).to.equal("key-pem")
    })
  })

  describe("getDiscoveryWithGatewayUrl", function() {
    it("fetches discovery and rewrites endpoint URLs to gateway", async function() {
      const rawDoc = {
        issuer: "https://identity.moneyhub.co.uk/oidc",
        authorization_endpoint: "https://identity.moneyhub.co.uk/oidc/authorize",
        token_endpoint: "https://identity.moneyhub.co.uk/oidc/token",
      }
      const gatewayBase = "https://gateway.example.com/identity/oidc"
      const mockGot = () => ({json: () => Promise.resolve(rawDoc)})
      const discovery = proxyquire("../discovery", {got: mockGot})
      const result = await discovery.getDiscoveryWithGatewayUrl(gatewayBase.replace("/oidc", ""))
      expect(result.issuer).to.equal("https://identity.moneyhub.co.uk/oidc")
      expect(result.authorization_endpoint).to.equal(gatewayBase + "/authorize")
      expect(result.token_endpoint).to.equal(gatewayBase + "/token")
    })
  })
})
