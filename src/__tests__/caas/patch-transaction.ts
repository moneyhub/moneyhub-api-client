/* eslint-disable max-nested-callbacks */
import {expect} from "chai"

import {Moneyhub, MoneyhubInstance} from "../.."
import {
  fetchSwaggerSpec,
  createRequestValidator,
  createResponseValidator,
  assertMatchesSwagger,
} from "./swagger"

const NEW_L2_CATEGORY_ID = "22"

describe("PATCH /accounts/{accountId}/transactions/{transactionId}", function() {
  let moneyhub: MoneyhubInstance

  before(async function() {
    moneyhub = await Moneyhub(this.config)
  })

  describe("patches a transaction and validates against swagger schema", function() {
    this.timeout(30000)

    let response: Awaited<ReturnType<typeof moneyhub.caasPatchTransaction>>
    let patchPayload: {l2CategoryId: string}
    let validateRequest: NonNullable<ReturnType<typeof createRequestValidator>>
    let validateResponse: NonNullable<ReturnType<typeof createResponseValidator>>

    before(async function() {
      if (this.skipTestsRequiringAccountId || this.skipSwaggerTests) {
        this.skip()
      }

      const {caas: {accountId}} = this.config
      const transactionId = this.transactionIds[0]

      patchPayload = {l2CategoryId: NEW_L2_CATEGORY_ID}

      response = await moneyhub.caasPatchTransaction({
        accountId,
        transactionId,
        ...patchPayload,
      })

      const spec = await fetchSwaggerSpec(this.config.caas.swaggerUrl)
      const reqValidator = createRequestValidator(spec, "/accounts/{accountId}/transactions/{transactionId}", "patch")
      const resValidator = createResponseValidator(spec, "/accounts/{accountId}/transactions/{transactionId}", "patch", "200")
      if (!reqValidator || !resValidator) throw new Error("Swagger schema missing for PATCH /accounts/{accountId}/transactions/{transactionId}")
      validateRequest = reqValidator
      validateResponse = resValidator
    })

    it("request payload matches swagger TransactionPatch schema", function() {
      assertMatchesSwagger(validateRequest, patchPayload, "Request body")
    })

    it("response matches swagger 200 schema", function() {
      assertMatchesSwagger(validateResponse, response, "Response")
    })

    it("response contains the patched transaction", function() {
      const {caas: {accountId}} = this.config
      const transactionId = this.transactionIds[0]

      expect(response.data.transactionId).to.equal(transactionId)
      expect(response.data.accountId).to.equal(accountId)
    })

    it("patched transaction has the new l2CategoryId", function() {
      expect(response.data.mhInsights.l2CategoryId).to.equal(NEW_L2_CATEGORY_ID)
    })
  })
})
