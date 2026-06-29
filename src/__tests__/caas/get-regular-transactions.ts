/* eslint-disable max-nested-callbacks */
import {expect} from "chai"

import {Moneyhub, MoneyhubInstance} from "../.."
import {
  fetchOpenApiSpec,
  createResponseValidator,
  assertMatchesOpenApi,
} from "./openapi"
import {assertTypeMatchesOpenApi} from "./typescript-validator"

const TYPES_FILE = "../../../requests/caas/types/regular-transactions.ts"

describe("GET /accounts/{accountId}/regular-transactions", function() {
  this.timeout(30000)

  let moneyhub: MoneyhubInstance
  let spec: Awaited<ReturnType<typeof fetchOpenApiSpec>>

  before(async function() {
    spec = await fetchOpenApiSpec(this.config.caas.openapiUrl)
    moneyhub = await Moneyhub(this.config)
  })

  describe("OpenAPI schema", function() {
    it("has a compilable 200 response schema", function() {
      const validateResponse = createResponseValidator(spec, "/accounts/{accountId}/regular-transactions", "get", "200")
      expect(validateResponse, "OpenAPI schema missing for GET /accounts/{accountId}/regular-transactions").to.exist
    })
  })

  describe("TypeScript types match OpenAPI schemas", function() {
    it("CaasRegularTransaction matches OpenAPI RegularTransaction definition", function() {
      assertTypeMatchesOpenApi({tsType: "CaasRegularTransaction", tsFile: TYPES_FILE, openApiSchemaName: "RegularTransaction", spec})
    })
  })

  describe("fetches regular transactions and validates against OpenAPI schema", function() {
    let response: Awaited<ReturnType<typeof moneyhub.caasGetRegularTransactions>>
    let validateResponse: NonNullable<ReturnType<typeof createResponseValidator>>

    before(async function() {
      if (this.skipTestsRequiringRegularTransactionsAccount) {
        this.skip()
      }

      const {caas: {regularTransactionsAccount}} = this.config
      response = await moneyhub.caasGetRegularTransactions({accountId: regularTransactionsAccount})

      const resValidator = createResponseValidator(spec, "/accounts/{accountId}/regular-transactions", "get", "200")
      if (!resValidator) throw new Error("OpenAPI schema missing for GET /accounts/{accountId}/regular-transactions")
      validateResponse = resValidator
    })

    it("response matches OpenAPI 200 schema", function() {
      assertMatchesOpenApi(validateResponse, response, "Response")
    })

    it("every returned regular transaction belongs to the requested account", function() {
      const {caas: {regularTransactionsAccount}} = this.config

      response.data.forEach((regularTransaction) => {
        expect(regularTransaction.accountId).to.equal(regularTransactionsAccount)
      })
    })
  })
})
