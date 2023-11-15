import {expect} from "chai"
import {addVersionToUrl} from "../request"

describe("addVersionToUrl", function() {
  it("should not add a version to an identity url", function() {
    const url = "https://identity.moneyhub.co.uk"
    expect(addVersionToUrl(url, true), url)
  })

  it("should add the default version to a URL without a version", function() {
    const url = "https://api.moneyhub.co.uk"
    const expected = "https://api.moneyhub.co.uk/v3"
    expect(addVersionToUrl(url, true), expected)
  })

  it("should not add the default version to a URL that already has a version", function() {
    const url = "https://api.moneyhub.co.uk/v2"
    expect(addVersionToUrl(url, true), url)
  })

  it("should add a specified version to a URL without a version", function() {
    const url = "https://api.moneyhub.co.uk"
    const version = "v2"
    const expected = "https://api.moneyhub.co.uk/v2"
    expect(addVersionToUrl(url, true, version), expected)
  })

  it("should not add a specified version to a URL that already has a version", function() {
    const url = "https://api.moneyhub.co.uk/v2"
    const version = "v3"
    expect(addVersionToUrl(url, true, version), url)
  })

  it("should not add a version to a URL if apiVersioning is false", function() {
    const url = "127.0.0.1:12345"
    expect(addVersionToUrl(url, false), url)
  })
})
