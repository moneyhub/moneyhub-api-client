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

describe("GET /counterparties", function() {
  let moneyhub: MoneyhubInstance

  before(async function() {
    moneyhub = await Moneyhub(this.config)
  })

  describe("fetches counterparties and validates against OpenAPI schema", function() {
    this.timeout(30000)

    let response: Awaited<ReturnType<typeof moneyhub.caasGetCounterparties>>
    let validateResponse: NonNullable<ReturnType<typeof createResponseValidator>>

    before(async function() {
      if (this.skipTestsRequiringCaasIds || this.skipOpenApiTests) {
        this.skip()
      }

      response = await moneyhub.caasGetCounterparties({limit: 1000})

      const spec = await fetchOpenApiSpec(this.config.caas.openapiUrl)
      const resValidator = createResponseValidator(spec, "/counterparties", "get", "200")
      if (!resValidator) throw new Error("OpenAPI schema missing for GET /counterparties")
      validateResponse = resValidator
    })

    it("response matches OpenAPI 200 schema", function() {
      const seededCounterparties = response.data.filter((counterparty) =>
        this.counterpartyIds.includes(counterparty.l3CounterpartyId))

      assertMatchesOpenApi(
        validateResponse,
        {...response, data: seededCounterparties},
        "Response",
      )
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

  describe("TypeScript types match OpenAPI schemas", function() {
    this.timeout(30000)

    let spec: Awaited<ReturnType<typeof fetchOpenApiSpec>>

    before(async function() {
      if (this.skipOpenApiTests) {
        this.skip()
      }

      spec = await fetchOpenApiSpec(this.config.caas.openapiUrl)
    })

    it("CaasCounterparty matches OpenAPI Counterparty definition", function() {
      assertTypeMatchesOpenApi({tsType: "CaasCounterparty", tsFile: TYPES_FILE, openApiSchemaName: "Counterparty", spec})
    })
  })
})
