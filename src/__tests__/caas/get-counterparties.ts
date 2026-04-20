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

describe("GET /counterparties", function() {
  let moneyhub: MoneyhubInstance

  before(async function() {
    moneyhub = await Moneyhub(this.config)
  })

  describe("fetches counterparties and validates against swagger schema", function() {
    this.timeout(30000)

    let response: Awaited<ReturnType<typeof moneyhub.caasGetCounterparties>>
    let validateResponse: NonNullable<ReturnType<typeof createResponseValidator>>

    before(async function() {
      if (this.skipTestsRequiringUserId || this.skipTestsRequiringAccountId || this.skipSwaggerTests) {
        this.skip()
      }

      response = await moneyhub.caasGetCounterparties({limit: 1000})

      const spec = await fetchSwaggerSpec(this.config.caas.swaggerUrl)
      const resValidator = createResponseValidator(spec, "/counterparties", "get", "200")
      if (!resValidator) throw new Error("Swagger schema missing for GET /counterparties")
      validateResponse = resValidator
    })

    it("response matches swagger 200 schema", function() {
      assertMatchesSwagger(validateResponse, response, "Response")
    })

    it("response contains the seeded counterparties", function() {
      const returnedIds = response.data.map((c) => c.l3CounterpartyId)

      this.counterpartyIds.forEach((seededId: string) => {
        expect(returnedIds).to.include(seededId)
      })
    })

    it("counterparties have the expected shape", function() {
      const first = response.data[0]

      expect(first).to.have.property("l3CounterpartyId")
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

    it("CaasCounterparty matches swagger Counterparty definition", function() {
      assertTypeMatchesSwagger({tsType: "CaasCounterparty", tsFile: TYPES_FILE, swaggerDefinitionName: "Counterparty", spec})
    })
  })
})
