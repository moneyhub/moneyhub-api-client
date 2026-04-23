/* eslint-disable max-nested-callbacks */
import {expect} from "chai"

import {Moneyhub, MoneyhubInstance} from "../.."
import {
  fetchSwaggerSpec,
  createResponseValidator,
  assertMatchesSwagger,
} from "./swagger"
import {assertTypeMatchesSwagger} from "./typescript-validator"

const TYPES_FILE = "../../../requests/caas/types/regular-transactions.ts"

describe("GET /accounts/{accountId}/regular-transactions", function() {
  this.timeout(30000)

  let moneyhub: MoneyhubInstance
  let spec: Awaited<ReturnType<typeof fetchSwaggerSpec>>

  before(async function() {
    if (this.skipSwaggerTests) {
      this.skip()
    }
    spec = await fetchSwaggerSpec(this.config.caas.swaggerUrl)
    moneyhub = await Moneyhub(this.config)
  })

  describe("swagger schema", function() {
    it("has a compilable 200 response schema", function() {
      const validateResponse = createResponseValidator(spec, "/accounts/{accountId}/regular-transactions", "get", "200")
      expect(validateResponse, "Swagger schema missing for GET /accounts/{accountId}/regular-transactions").to.exist
    })
  })

  describe("TypeScript types match swagger definitions", function() {
    it("CaasRegularTransaction matches swagger RegularTransaction definition", function() {
      assertTypeMatchesSwagger({tsType: "CaasRegularTransaction", tsFile: TYPES_FILE, swaggerDefinitionName: "RegularTransaction", spec})
    })
  })

  describe("fetches regular transactions and validates against swagger schema", function() {
    let response: Awaited<ReturnType<typeof moneyhub.caasGetRegularTransactions>>
    let validateResponse: NonNullable<ReturnType<typeof createResponseValidator>>

    before(async function() {
      if (this.skipTestsRequiringRegularTransactionsAccount) {
        this.skip()
      }

      const {caas: {regularTransactionsAccount}} = this.config
      response = await moneyhub.caasGetRegularTransactions({accountId: regularTransactionsAccount})

      const resValidator = createResponseValidator(spec, "/accounts/{accountId}/regular-transactions", "get", "200")
      if (!resValidator) throw new Error("Swagger schema missing for GET /accounts/{accountId}/regular-transactions")
      validateResponse = resValidator
    })

    it("response matches swagger 200 schema", function() {
      assertMatchesSwagger(validateResponse, response, "Response")
    })

    it("every returned regular transaction belongs to the requested account", function() {
      const {caas: {regularTransactionsAccount}} = this.config

      response.data.forEach((regularTransaction) => {
        expect(regularTransaction.accountId).to.equal(regularTransactionsAccount)
      })
    })
  })
})
