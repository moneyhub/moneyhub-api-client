/* eslint-disable max-nested-callbacks */
import {expect} from "chai"

import {Moneyhub, MoneyhubInstance} from "../.."
import {
  fetchOpenApiSpec,
  createResponseValidator,
  assertMatchesOpenApi,
} from "./openapi"
import {assertTypeMatchesOpenApi} from "./typescript-validator"

const TYPES_FILE = "../../../requests/caas/types/enhanced-transactions.ts"

describe("GET /accounts/{accountId}/transactions/{transactionId}/enhanced", function() {
  this.timeout(30000)

  let moneyhub: MoneyhubInstance
  let spec: Awaited<ReturnType<typeof fetchOpenApiSpec>>

  before(async function() {
    if (this.skipOpenApiTests) {
      this.skip()
    }

    spec = await fetchOpenApiSpec(this.config.caas.openapiUrl)
    moneyhub = await Moneyhub(this.config)
  })

  describe("OpenAPI schema", function() {
    it("has a compilable 200 response schema", function() {
      const validateResponse = createResponseValidator(spec, "/accounts/{accountId}/transactions/{transactionId}/enhanced", "get", "200")
      expect(validateResponse, "OpenAPI schema missing for GET /accounts/{accountId}/transactions/{transactionId}/enhanced").to.exist
    })
  })

  describe("TypeScript types match OpenAPI schemas", function() {
    it("CaasEnhancedTransaction matches OpenAPI EnhancedLocationData definition", function() {
      assertTypeMatchesOpenApi({tsType: "CaasEnhancedTransaction", tsFile: TYPES_FILE, openApiSchemaName: "EnhancedLocationData", spec})
    })
  })

  describe("fetches an enhanced transaction and validates against OpenAPI schema", function() {
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
      if (!resValidator) throw new Error("OpenAPI schema missing for GET /accounts/{accountId}/transactions/{transactionId}/enhanced")
      validateResponse = resValidator
    })

    it("response matches OpenAPI 200 schema", function() {
      assertMatchesOpenApi(validateResponse, response, "Response")
    })

    it("response is for the requested transaction", function() {
      const {caas: {accountId}} = this.config
      const [transactionId] = this.transactionIds

      expect(response.data.accountId).to.equal(accountId)
      expect(response.data.transactionId).to.equal(transactionId)
    })
  })
})
