/* eslint-disable max-nested-callbacks */
import path from "path"
import {expect} from "chai"

import {Moneyhub, MoneyhubInstance} from "../.."
import type {CaasTransactionInput} from "../../requests/caas/types/transactions"
import type {CaasTestConfig} from "./types"

import {
  fetchSwaggerSpec,
  createRequestValidator,
  createResponseValidator,
  formatErrors,
} from "./swagger"
import {assertTypeMatchesSwagger} from "./schema-comparison"

const TYPES_FILE = path.resolve(__dirname, "../../requests/caas/types/transactions.ts")

describe.only("POST /transactions/enrich", function() {
  let moneyhub: MoneyhubInstance
  let validateRequest: NonNullable<ReturnType<typeof createRequestValidator>>
  let validateResponse: NonNullable<ReturnType<typeof createResponseValidator>>

  before(async function() {
    if (!this.config.caas) {
      throw new Error(
        "Missing \"caas\" config block. Expected structure:\n"
        + JSON.stringify({
          caas: {
            swaggerUrl: "https://<api-gateway>.co.uk/caas/swagger-enrichment-engine.json",
            userId: "user-id-12345678",
            accountId: "account-id-12345678",
          },
        }, null, 2)
        + "\n Caas config must be added to the top level of your client config object",
      )
    }

    moneyhub = await Moneyhub(this.config)
    const spec = await fetchSwaggerSpec(this.config.caas.swaggerUrl)
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
      expect(validateRequest).to.not.be.null
      const valid = validateRequest(transactionsPayload)
      expect(
        valid,
        `Request body does not match swagger schema (TypeScript types may be out of sync):\n${formatErrors(validateRequest, transactionsPayload)}`,
      ).to.be.true
    })

    it("response matches swagger 201 schema", function() {
      expect(validateResponse).to.not.be.null
      const valid = validateResponse(response)
      expect(
        valid,
        `Response does not match swagger schema (TypeScript types may be out of sync):\n${formatErrors(validateResponse, response)}`,
      ).to.be.true
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
      assertTypeMatchesSwagger("CaasTransactionInput", TYPES_FILE, "TransactionPost", spec)
    })

    it("CaasTransaction matches swagger EnrichedTransaction definition", function() {
      assertTypeMatchesSwagger("CaasTransaction", TYPES_FILE, "EnrichedTransaction", spec)
    })
  })
})
