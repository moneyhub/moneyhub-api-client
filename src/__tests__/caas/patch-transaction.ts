/* eslint-disable max-nested-callbacks */
import {expect} from "chai"

import {Moneyhub, MoneyhubInstance} from "../.."
import {
  fetchOpenApiSpec,
  createRequestValidator,
  createResponseValidator,
  assertMatchesOpenApi,
} from "./openapi"

const USER_CATEGORY_ID = "22"

describe("PATCH /accounts/{accountId}/transactions/{transactionId}", function() {
  let moneyhub: MoneyhubInstance

  before(async function() {
    moneyhub = await Moneyhub(this.config)
  })

  describe("patches a transaction and validates against OpenAPI schema", function() {
    this.timeout(30000)

    let response: Awaited<ReturnType<typeof moneyhub.caasPatchTransaction>>
    let patchPayload: {userCategoryId: string}
    let validateRequest: NonNullable<ReturnType<typeof createRequestValidator>>
    let validateResponse: NonNullable<ReturnType<typeof createResponseValidator>>

    before(async function() {
      if (this.skipTestsRequiringCaasIds) {
        this.skip()
      }

      const {caas: {accountId}} = this.config
      const transactionId = this.transactionIds[0]

      patchPayload = {userCategoryId: USER_CATEGORY_ID}

      response = await moneyhub.caasPatchTransaction({
        accountId,
        transactionId,
        ...patchPayload,
      })

      const spec = await fetchOpenApiSpec(this.config.caas.openapiUrl)
      const reqValidator = createRequestValidator(spec, "/accounts/{accountId}/transactions/{transactionId}", "patch")
      const resValidator = createResponseValidator(spec, "/accounts/{accountId}/transactions/{transactionId}", "patch", "200")
      if (!reqValidator || !resValidator) throw new Error("OpenAPI schema missing for PATCH /accounts/{accountId}/transactions/{transactionId}")
      validateRequest = reqValidator
      validateResponse = resValidator
    })

    it("request payload matches OpenAPI TransactionPatch schema", function() {
      assertMatchesOpenApi(validateRequest, patchPayload, "Request body")
    })

    it("response matches OpenAPI 200 schema", function() {
      assertMatchesOpenApi(validateResponse, response, "Response")
    })

    it("response contains the patched transaction", function() {
      const {caas: {accountId}} = this.config
      const transactionId = this.transactionIds[0]

      expect(response.data.transactionId).to.equal(transactionId)
      expect(response.data.accountId).to.equal(accountId)
    })

    it("patched transaction has the new userCategoryId", function() {
      expect(response.data.mhInsights.userCategoryId).to.equal(USER_CATEGORY_ID)
    })
  })
})
