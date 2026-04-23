/* eslint-disable max-nested-callbacks */
import {expect} from "chai"

import {Moneyhub, MoneyhubInstance} from "../.."
import {
  fetchSwaggerSpec,
  createResponseValidator,
  assertMatchesSwagger,
} from "./swagger"

describe("GET /transactions", function() {
  let moneyhub: MoneyhubInstance

  before(async function() {
    moneyhub = await Moneyhub(this.config)
  })

  describe("fetches transactions and validates against swagger schema", function() {
    this.timeout(30000)

    let response: Awaited<ReturnType<typeof moneyhub.caasGetTransactions>>
    let validateResponse: NonNullable<ReturnType<typeof createResponseValidator>>

    before(async function() {
      if (this.skipTestsRequiringCaasIds || this.skipSwaggerTests) {
        this.skip()
      }

      const {caas: {userId, accountId}} = this.config

      response = await moneyhub.caasGetTransactions({userId, accountId})

      const spec = await fetchSwaggerSpec(this.config.caas.swaggerUrl)
      const resValidator = createResponseValidator(spec, "/transactions", "get", "200")
      if (!resValidator) throw new Error("Swagger schema missing for GET /transactions")
      validateResponse = resValidator
    })

    it("response matches swagger 200 schema", function() {
      assertMatchesSwagger(validateResponse, response, "Response")
    })

    it("response contains the seeded transactions", function() {
      const returnedIds = response.data.map((t) => t.transactionId)

      this.transactionIds.forEach((seededId: string) => {
        expect(returnedIds).to.include(seededId)
      })
    })

    it("every returned transaction belongs to the requested account", function() {
      const {caas: {accountId}} = this.config

      response.data.forEach((transaction) => {
        expect(transaction.accountId).to.equal(accountId)
      })
    })
  })
})
