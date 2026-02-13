import {expect} from "chai"
import {addVersionToUrl} from "../request"

const proxyquire = require("proxyquire").noCallThru()

describe("request (unit)", function() {
  describe("addVersionToUrl (unit)", function() {
    it("should not add a version to an identity url", function() {
      const url = "https://identity.moneyhub.co.uk"
      expect(addVersionToUrl(url, true)).to.eql(url)
    })

    it("should add the default version to a URL without a version", function() {
      const url = "https://api.moneyhub.co.uk"
      const expected = "https://api.moneyhub.co.uk/v3"
      expect(addVersionToUrl(url, true)).to.eql(expected)
    })

    it("should add the default version to a URL without a version but a path", function() {
      const url = "https://api.moneyhub.co.uk/transactions"
      const expected = "https://api.moneyhub.co.uk/v3/transactions"
      expect(addVersionToUrl(url, true)).to.eql(expected)
    })

    it("should add the default version to a URL without a version but a long path", function() {
      const url = "https://api.moneyhub.co.uk/transactions/1234/data"
      const expected = "https://api.moneyhub.co.uk/v3/transactions/1234/data"
      expect(addVersionToUrl(url, true)).to.eql(expected)
    })

    it("should not add the default version to a URL that already has a version", function() {
      const url = "https://api.moneyhub.co.uk/v2"
      expect(addVersionToUrl(url, true)).to.eql(url)
    })

    it("should add a specified version to a URL without a version", function() {
      const url = "https://api.moneyhub.co.uk"
      const version = "v2"
      const expected = "https://api.moneyhub.co.uk/v2"
      expect(addVersionToUrl(url, true, version)).to.eql(expected)
    })

    it("should add a specified version to a URL without a version but a path", function() {
      const url = "https://api.moneyhub.co.uk/transactions"
      const version = "v2"
      const expected = "https://api.moneyhub.co.uk/v2/transactions"
      expect(addVersionToUrl(url, true, version)).to.eql(expected)
    })

    it("should add a specified version to a URL without a version but a long path", function() {
      const url = "https://api.moneyhub.co.uk/transactions/1234/data"
      const version = "v2"
      const expected = "https://api.moneyhub.co.uk/v2/transactions/1234/data"
      expect(addVersionToUrl(url, true, version)).to.eql(expected)
    })

    it("should not add a specified version to a URL that already has a version", function() {
      const url = "https://api.moneyhub.co.uk/v2"
      const version = "v3"
      expect(addVersionToUrl(url, true, version)).to.eql(url)
    })

    it("should not add a version to a URL if apiVersioning is false", function() {
      const url = "127.0.0.1:12345"
      expect(addVersionToUrl(url, false)).to.eql(url)
    })
  })

  describe("request factory (unit)", function() {
    it("should return JSON body when got resolves", async function() {
      const mockGot = () => ({json: () => Promise.resolve({data: "ok"})})
      const requestModule = proxyquire("../request", {got: mockGot})
      const request = requestModule.default({
        client: {grant: () => Promise.resolve({access_token: "t"})},
        options: {apiVersioning: true},
      })
      const result = await request("https://api.example.com/things")
      expect(result).to.deep.equal({data: "ok"})
    })

    it("should return status code when returnStatus is true", async function() {
      const mockGot = () => Promise.resolve({statusCode: 204})
      const requestModule = proxyquire("../request", {got: mockGot})
      const request = requestModule.default({
        client: {grant: () => Promise.resolve({access_token: "t"})},
        options: {apiVersioning: true},
      })
      const result = await request("https://api.example.com/delete", {method: "DELETE", returnStatus: true})
      expect(result).to.equal(204)
    })

    it("should attach error details when got rejects with response body", async function() {
      const errBody = {code: "ERR", message: "Bad request", details: "extra"}
      const mockGot = () => ({
        json: () =>
          Promise.reject(
            Object.assign(new Error("fail"), {
              response: {body: JSON.stringify(errBody)},
            }),
          ),
      })
      const requestModule = proxyquire("../request", {got: mockGot})
      const request = requestModule.default({
        client: {grant: () => Promise.resolve({access_token: "t"})},
        options: {apiVersioning: true},
      })
      try {
        await request("https://api.example.com/things")
        expect.fail("should have thrown")
      } catch (e: any) {
        expect(e.error).to.equal("ERR")
        expect(e.error_description).to.equal("Bad request")
        expect(e.error_details).to.equal("extra")
      }
    })

    it("should use options.token when provided", async function() {
      let capturedOpts: any
      const mockGot = (_url: string, opts: any) => {
        capturedOpts = opts
        return {json: () => Promise.resolve({})}
      }
      const requestModule = proxyquire("../request", {got: mockGot})
      const request = requestModule.default({
        client: {},
        options: {apiVersioning: true},
      })
      await request("https://api.example.com/things", {options: {token: "custom-token"}})
      expect(capturedOpts.headers?.Authorization).to.equal("Bearer custom-token")
    })

    it("should call client.grant when cc.scope is provided and no Authorization header", async function() {
      let grantCalled = false
      const mockGot = (_url: string, opts: any) => {
        expect(opts.headers?.Authorization).to.equal("Bearer access-token-123")
        return {json: () => Promise.resolve({})}
      }
      const requestModule = proxyquire("../request", {got: mockGot})
      const request = requestModule.default({
        client: {
          grant: async () => {
            grantCalled = true
            return {access_token: "access-token-123"}
          },
        },
        options: {apiVersioning: true},
      })
      await request("https://api.example.com/accounts", {cc: {scope: "accounts:read"}})
      expect(grantCalled).to.be.true
    })

    it("should send body as JSON when opts.body is provided", async function() {
      let capturedOpts: any
      const mockGot = (_url: string, opts: any) => {
        capturedOpts = opts
        return {json: () => Promise.resolve({})}
      }
      const requestModule = proxyquire("../request", {got: mockGot})
      const request = requestModule.default({
        client: {},
        options: {apiVersioning: true},
      })
      await request("https://api.example.com/things", {method: "POST", body: {foo: "bar"}})
      expect(capturedOpts.json).to.deep.equal({foo: "bar"})
    })

    it("should add version to API URL when apiVersioning is true", async function() {
      let capturedUrl: string
      const mockGot = (url: string) => {
        capturedUrl = url
        return {json: () => Promise.resolve({})}
      }
      const requestModule = proxyquire("../request", {got: mockGot})
      const request = requestModule.default({
        client: {},
        options: {apiVersioning: true},
      })
      await request("https://api.example.com/accounts")
      expect(capturedUrl!).to.equal("https://api.example.com/v3/accounts")
    })
  })
})
