/* eslint-disable max-nested-callbacks */
import {expect} from "chai"

import {Moneyhub, MoneyhubInstance} from "../.."

import {
  fetchOpenApiSpec,
  createResponseValidator,
  assertMatchesOpenApi,
} from "./openapi"
import {assertTypeMatchesOpenApi} from "./typescript-validator"

const TYPES_FILE = "../../../requests/caas/types/transactions.ts"

describe("GET /geotags", function() {
  let moneyhub: MoneyhubInstance

  before(async function() {
    moneyhub = await Moneyhub(this.config)
  })

  describe("fetches geotags and validates against OpenAPI schema", function() {
    this.timeout(30000)

    let response: Awaited<ReturnType<typeof moneyhub.caasGetGeotags>>
    let validateResponse: NonNullable<ReturnType<typeof createResponseValidator>>

    before(async function() {
      if (this.skipTestsRequiringCaasIds || this.skipOpenApiTests) {
        this.skip()
      }

      response = await moneyhub.caasGetGeotags({geotagIds: this.geotagIds})

      const spec = await fetchOpenApiSpec(this.config.caas.openapiUrl)
      const resValidator = createResponseValidator(spec, "/geotags", "get", "200")
      if (!resValidator) throw new Error("OpenAPI schema missing for GET /geotags")
      validateResponse = resValidator
    })

    it("response matches OpenAPI 200 schema", function() {
      assertMatchesOpenApi(validateResponse, response, "Response")
    })

    it("response contains the requested geotags", function() {
      const returnedIds = response.data.map((g) => g.geotagId)

      this.geotagIds.forEach((requestedId: string) => {
        expect(returnedIds).to.include(requestedId)
      })
    })

    it("geotags have the expected shape", function() {
      const first = response.data[0]

      expect(first).to.have.property("geotagId")
      expect(first).to.have.property("counterpartyName")
      expect(first).to.have.property("counterpartyLabel")
      expect(first).to.have.property("latitude")
      expect(first).to.have.property("longitude")
    })
  })

  describe("TypeScript types match OpenAPI schemas", function() {
    this.timeout(30000)

    let spec: Awaited<ReturnType<typeof fetchOpenApiSpec>>

    before(async function() {
      if (this.skipOpenApiTests) {
        this.skip()
      }

      spec = await fetchOpenApiSpec(this.config.caas.openapiUrl)
    })

    it("CaasGeotag matches OpenAPI Geotag definition", function() {
      assertTypeMatchesOpenApi({tsType: "CaasGeotag", tsFile: TYPES_FILE, openApiSchemaName: "Geotag", spec})
    })
  })
})
