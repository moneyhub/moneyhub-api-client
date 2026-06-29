import {expect} from "chai"

import {deriveOpenApiUrl, resolveOpenApiUrl} from "./openapi"

describe("resolveOpenApiUrl", function() {
  it("derives openapi.json from gatewayCaasResourceServerUrl", function() {
    expect(resolveOpenApiUrl({
      gatewayCaasResourceServerUrl: "https://api-dev.moneyhub.co.uk/caas/v1",
    })).to.equal("https://api-dev.moneyhub.co.uk/caas/openapi.json")
  })

  it("derives openapi.json from resourceServerUrl", function() {
    expect(resolveOpenApiUrl({
      resourceServerUrl: "https://api-dev.moneyhub.co.uk/v2",
    })).to.equal("https://api-dev.moneyhub.co.uk/caas/openapi.json")
  })

  it("prefers an explicit caas.openapiUrl override", function() {
    expect(resolveOpenApiUrl({
      gatewayCaasResourceServerUrl: "https://api-dev.moneyhub.co.uk/caas/v1",
      caas: {
        openapiUrl: "https://custom.example/caas/openapi.json",
      },
    })).to.equal("https://custom.example/caas/openapi.json")
  })

  it("derives from caasResourceServerUrl", function() {
    expect(deriveOpenApiUrl("https://gateway.example/caas/v1/")).to.equal("https://gateway.example/caas/openapi.json")
  })
})
