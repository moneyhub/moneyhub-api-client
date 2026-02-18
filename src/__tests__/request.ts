import {expect} from "chai"
import {addVersionToUrl} from "../request"

describe("addVersionToUrl", function() {
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

  it("should not add a version to identity-service paths when identityServiceUrl is provided (gateway)", function() {
    const identityServiceUrl = "https://my-gateway.example.com"
    expect(addVersionToUrl(`${identityServiceUrl}/auth-requests`, true, undefined, identityServiceUrl)).to.eql(`${identityServiceUrl}/auth-requests`)
    expect(addVersionToUrl(`${identityServiceUrl}/pay-links`, true, undefined, identityServiceUrl)).to.eql(`${identityServiceUrl}/pay-links`)
    expect(addVersionToUrl(`${identityServiceUrl}/payees`, true, undefined, identityServiceUrl)).to.eql(`${identityServiceUrl}/payees`)
    expect(addVersionToUrl(`${identityServiceUrl}/oidc/.well-known/openid-configuration`, true, undefined, identityServiceUrl)).to.eql(`${identityServiceUrl}/oidc/.well-known/openid-configuration`)
    expect(addVersionToUrl(`${identityServiceUrl}/users`, true, undefined, identityServiceUrl)).to.eql(`${identityServiceUrl}/users`)
    expect(addVersionToUrl(`${identityServiceUrl}/scim/users`, true, undefined, identityServiceUrl)).to.eql(`${identityServiceUrl}/scim/users`)
  })
})
