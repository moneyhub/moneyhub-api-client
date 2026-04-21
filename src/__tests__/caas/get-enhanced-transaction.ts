/* eslint-disable max-nested-callbacks */
import {expect} from "chai"

import {Moneyhub, MoneyhubInstance} from "../.."
import {
  fetchSwaggerSpec,
  createResponseValidator,
  assertMatchesSwagger,
} from "./swagger"
import {assertTypeMatchesSwagger} from "./typescript-validator"

const TYPES_FILE = "../../../requests/caas/types/enhanced-transactions.ts"

describe("GET /accounts/{accountId}/transactions/{transactionId}/enhanced", function() {
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
      const validateResponse = createResponseValidator(spec, "/accounts/{accountId}/transactions/{transactionId}/enhanced", "get", "200")
      expect(validateResponse, "Swagger schema missing for GET /accounts/{accountId}/transactions/{transactionId}/enhanced").to.exist
    })
  })

  describe("TypeScript types match swagger definitions", function() {
    it("CaasEnhancedTransaction matches swagger EnhancedLocationData definition", function() {
      assertTypeMatchesSwagger({tsType: "CaasEnhancedTransaction", tsFile: TYPES_FILE, swaggerDefinitionName: "EnhancedLocationData", spec})
    })
  })

  describe("fetches an enhanced transaction and validates against swagger schema", function() {
    let response: Awaited<ReturnType<typeof moneyhub.caasGetEnhancedTransaction>>
    let validateResponse: NonNullable<ReturnType<typeof createResponseValidator>>

    before(async function() {
      if (this.skipTestsRequiringEnhancedTransactions || this.skipTestsRequiringCaasIds) {
        this.skip()
      }

      const {caas: {accountId}} = this.config
      const [transactionId] = this.transactionIds

      response = await moneyhub.caasGetEnhancedTransaction({accountId, transactionId})

      const resValidator = createResponseValidator(spec, "/accounts/{accountId}/transactions/{transactionId}/enhanced", "get", "200")
      if (!resValidator) throw new Error("Swagger schema missing for GET /accounts/{accountId}/transactions/{transactionId}/enhanced")
      validateResponse = resValidator
    })

    it("response matches swagger 200 schema", function() {
      assertMatchesSwagger(validateResponse, response, "Response")
    })

    it("response is for the requested transaction", function() {
      const {caas: {accountId}} = this.config
      const [transactionId] = this.transactionIds

      expect(response.data.accountId).to.equal(accountId)
      expect(response.data.transactionId).to.equal(transactionId)
    })
  })
})
