/* eslint-disable max-nested-callbacks */
import {expect} from "chai"

import {Moneyhub, MoneyhubInstance} from "../.."

import {
  fetchSwaggerSpec,
  createResponseValidator,
  assertMatchesSwagger,
} from "./swagger"
import {assertTypeMatchesSwagger} from "./typescript-validator"

const TYPES_FILE = "../../../requests/caas/types/transactions.ts"

describe("GET /geotags", function() {
  let moneyhub: MoneyhubInstance

  before(async function() {
    moneyhub = await Moneyhub(this.config)
  })

  describe("fetches geotags and validates against swagger schema", function() {
    this.timeout(30000)

    let response: Awaited<ReturnType<typeof moneyhub.caasGetGeotags>>
    let validateResponse: NonNullable<ReturnType<typeof createResponseValidator>>

    before(async function() {
      if (this.skipTestsRequiringUserId || this.skipTestsRequiringAccountId || this.skipSwaggerTests) {
        this.skip()
      }

      response = await moneyhub.caasGetGeotags({geotagIds: this.geotagIds})

      const spec = await fetchSwaggerSpec(this.config.caas.swaggerUrl)
      const resValidator = createResponseValidator(spec, "/geotags", "get", "200")
      if (!resValidator) throw new Error("Swagger schema missing for GET /geotags")
      validateResponse = resValidator
    })

    it("response matches swagger 200 schema", function() {
      assertMatchesSwagger(validateResponse, response, "Response")
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

  describe("TypeScript types match swagger definitions", function() {
    this.timeout(30000)

    let spec: Awaited<ReturnType<typeof fetchSwaggerSpec>>

    before(async function() {
      if (this.skipSwaggerTests) {
        this.skip()
      }
      spec = await fetchSwaggerSpec(this.config.caas.swaggerUrl)
    })

    it("CaasGeotag matches swagger Geotag definition", function() {
      assertTypeMatchesSwagger({tsType: "CaasGeotag", tsFile: TYPES_FILE, swaggerDefinitionName: "Geotag", spec})
    })
  })
})
