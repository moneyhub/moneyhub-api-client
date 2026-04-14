/* eslint-disable max-nested-callbacks */
import {expect} from "chai"

import {Moneyhub, MoneyhubInstance} from "../.."
import type {CaasTransactionInput} from "../../requests/caas/types/transactions"
import type {CaasTestConfig} from "./types"

import {
  fetchSwaggerSpec,
  createRequestValidator,
  createResponseValidator,
  assertMatchesSwagger,
} from "./swagger"
import {assertTypeMatchesSwagger} from "./schema-comparison"

const TYPES_FILE = "../../requests/caas/types/transactions.ts"

describe.only("POST /transactions/enrich", function() {
  let moneyhub: MoneyhubInstance
  let validateRequest: NonNullable<ReturnType<typeof createRequestValidator>>
  let validateResponse: NonNullable<ReturnType<typeof createResponseValidator>>

  before(async function() {
    moneyhub = await Moneyhub(this.config)
    const spec = await fetchSwaggerSpec(this.config.caas?.swaggerUrl)
    const reqValidator = createRequestValidator(spec, "/transactions/enrich", "post")
    const resValidator = createResponseValidator(spec, "/transactions/enrich", "post", "201")
    if (!reqValidator || !resValidator) throw new Error("Swagger schema missing for POST /transactions/enrich")
    validateRequest = reqValidator
    validateResponse = resValidator
  })

  describe("enriches transactions and validates against swagger schema", function() {
    let response: Awaited<ReturnType<typeof moneyhub.caasEnrichTransactions>>
    let transactionsPayload: CaasTransactionInput[]

    before(async function() {
      const {caas} = this.config as CaasTestConfig
      if (!caas?.accountId) {
        throw new Error(
          "Missing caas.accountId in config. This test requires a valid accountId.",
        )
      }

      transactionsPayload = [
        {
          userId: caas.userId,
          accountId: caas.accountId,
          transactionId: "08820421-8472-4254-8608-f0d59e3b0a87",
          accountType: "cash",
          txCode: "DEB",
          date: new Date().toISOString(),
          status: "posted",
          description: "Tesco Stores 1234",
          amount: -45.5,
          currency: "GBP",
        },
        {
          userId: caas.userId,
          accountId: caas.accountId,
          transactionId: "3c4e27be-17dd-45e2-9b1e-041623daf104",
          accountType: "cash",
          txCode: "DD",
          date: new Date().toISOString(),
          status: "posted",
          description: "Netflix",
          amount: -15.99,
          currency: "GBP",
        },
      ]

      response = await moneyhub.caasEnrichTransactions({transactions: transactionsPayload})
    })

    it("request payload matches swagger TransactionPost schema", function() {
      assertMatchesSwagger(validateRequest, transactionsPayload, "Request body")
    })

    it("response matches swagger 201 schema", function() {
      assertMatchesSwagger(validateResponse, response, "Response")
    })

    it("response contains enriched transactions", function() {
      expect(response.data).to.be.an("array").with.length.above(0)
    })

    it("enriched transactions have mhInsights with category fields", function() {
      const first = response.data[0]

      expect(first).to.have.property("mhInsights")
      expect(first.mhInsights).to.have.property("l2CategoryId")
      expect(first.mhInsights).to.have.property("l2CategoryName")
      expect(first.mhInsights).to.have.property("l1CategoryGroupId")
      expect(first.mhInsights).to.have.property("l1CategoryGroupName")
    })

  })

  describe("TypeScript types match swagger definitions", function() {
    let spec: Awaited<ReturnType<typeof fetchSwaggerSpec>>

    before(async function() {
      spec = await fetchSwaggerSpec(this.config.caas.swaggerUrl)
    })

    it("CaasTransactionInput matches swagger TransactionPost definition", function() {
      assertTypeMatchesSwagger({tsType: "CaasTransactionInput", tsFile: TYPES_FILE, swaggerDefName: "TransactionPost", spec})
    })

    it("CaasTransaction matches swagger EnrichedTransaction definition", function() {
      assertTypeMatchesSwagger({tsType: "CaasTransaction", tsFile: TYPES_FILE, swaggerDefName: "EnrichedTransaction", spec})
    })
  })
})
