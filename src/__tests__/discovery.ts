import {expect} from "chai"
import {
  rewriteUrlsInObject,
  rewriteDiscoveryUrls,
  inferCanonicalBaseFromLinkUrl,
  rewriteResourceServerResponseUrls,
} from "../discovery"

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

    it("handles path without version segment", function() {
      const url = "https://api.example.com/accounts"
      expect(inferCanonicalBaseFromLinkUrl(url)).to.equal("https://api.example.com/accounts")
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
  })
})
