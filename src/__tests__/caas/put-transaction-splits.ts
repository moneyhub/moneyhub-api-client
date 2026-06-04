/* eslint-disable max-nested-callbacks */
import {expect} from "chai"

import {Moneyhub, MoneyhubInstance} from "../.."
import type {CaasTransactionSplitBody} from "../../requests/caas/types/transaction-splits"
import {
  fetchSwaggerSpec,
  createRequestValidator,
  createResponseValidator,
  assertMatchesSwagger,
} from "./swagger"

const SPLITS_PATH = "/accounts/{accountId}/transactions/{transactionId}/splits"

describe("PUT /accounts/{accountId}/transactions/{transactionId}/splits", function() {
  let moneyhub: MoneyhubInstance

  before(async function() {
    moneyhub = await Moneyhub(this.config)
  })

  describe("upserts splits and validates against swagger schema", function() {
    this.timeout(30000)

    let response: Awaited<ReturnType<typeof moneyhub.caasPutTransactionSplits>>
    let requestBody: {data: CaasTransactionSplitBody[]}
    let validateRequest: NonNullable<ReturnType<typeof createRequestValidator>>
    let validateResponse: NonNullable<ReturnType<typeof createResponseValidator>>

    before(async function() {
      if (this.skipTestsRequiringCaasIds || this.skipSwaggerTests) {
        this.skip()
      }

      const {caas: {accountId}} = this.config
      const transactionId = this.transactionIds[0]

      requestBody = {
        data: [
          {amount: -30, userCategoryId: "22", description: "Food"},
          {amount: -15.5, userCategoryId: "44", description: "Gift"},
        ],
      }

      response = await moneyhub.caasPutTransactionSplits({
        accountId,
        transactionId,
        splits: requestBody.data,
      })

      const spec = await fetchSwaggerSpec(this.config.caas.swaggerUrl)
      const reqValidator = createRequestValidator(spec, SPLITS_PATH, "put")
      const resValidator = createResponseValidator(spec, SPLITS_PATH, "put", "200")
      if (!reqValidator || !resValidator) {
        throw new Error(`Swagger schema missing for PUT ${SPLITS_PATH}`)
      }
      validateRequest = reqValidator
      validateResponse = resValidator
    })

    after(async function() {
      if (this.skipTestsRequiringCaasIds) {
        return
      }

      const {caas: {accountId}} = this.config
      const transactionId = this.transactionIds[0]

      await moneyhub.caasDeleteTransactionSplits({accountId, transactionId})
    })

    it("request payload matches swagger TransactionSplitPut schema", function() {
      assertMatchesSwagger(validateRequest, requestBody, "Request body")
    })

    it("response matches swagger 200 schema", function() {
      assertMatchesSwagger(validateResponse, response, "Response")
    })

    it("response contains the upserted splits", function() {
      expect(response.data).to.have.length(2)
      expect(response.data[0]).to.include({
        amount: -30,
        userCategoryId: "22",
        description: "Food",
      })
      expect(response.data[1]).to.include({
        amount: -15.5,
        userCategoryId: "44",
        description: "Gift",
      })
    })
  })
})
