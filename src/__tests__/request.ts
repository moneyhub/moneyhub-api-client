import {expect} from "chai"
import {addVersionToUrl} from "../request"

describe("addVersionToUrl", function() {
  it("should not add a version to an identity url", function() {
    const url = "https://identity.moneyhub.co.uk"
    expect(addVersionToUrl(url), url)
  })

  it("should add the default version to a URL without a version", function() {
    const url = "https://api.moneyhub.co.uk"
    const expected = "https://api.moneyhub.co.uk/v3"
    expect(addVersionToUrl(url), expected)
  })

  it("should not add the default version to a URL that already has a version", function() {
    const url = "https://api.moneyhub.co.uk/v2"
    expect(addVersionToUrl(url), url)
  })

  it("should add a specified version to a URL without a version", function() {
    const url = "https://api.moneyhub.co.uk"
    const version = "v2"
    const expected = "https://api.moneyhub.co.uk/v2"
    expect(addVersionToUrl(url, version), expected)
  })

  it("should not add a specified version to a URL that already has a version", function() {
    const url = "https://api.moneyhub.co.uk/v2"
    const version = "v3"
    expect(addVersionToUrl(url, version), url)
  })
})
