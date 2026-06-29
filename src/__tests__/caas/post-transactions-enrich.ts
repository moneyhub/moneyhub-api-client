/* eslint-disable max-nested-callbacks */
import {expect} from "chai"

import {Moneyhub, MoneyhubInstance} from "../.."
import type {CaasTransactionInput} from "../../requests/caas/types/transactions"
import {
  fetchOpenApiSpec,
  createRequestValidator,
  createResponseValidator,
  assertMatchesOpenApi,
} from "./openapi"
import {assertTypeMatchesOpenApi} from "./typescript-validator"

const TYPES_FILE = "../../../requests/caas/types/transactions.ts"

describe("POST /transactions/enrich", function() {
  let moneyhub: MoneyhubInstance

  before(async function() {
    moneyhub = await Moneyhub(this.config)
  })

  describe("enriches transactions and validates against OpenAPI schema", function() {
    this.timeout(30000)

    let response: Awaited<ReturnType<typeof moneyhub.caasEnrichTransactions>>
    let transactionsPayload: CaasTransactionInput[]
    let validateRequest: NonNullable<ReturnType<typeof createRequestValidator>>
    let validateResponse: NonNullable<ReturnType<typeof createResponseValidator>>

    before(async function() {
      if (this.skipTestsRequiringCaasIds) {
        this.skip()
      }

      const {caas: {userId, accountId}} = this.config

      transactionsPayload = [
        {
          userId,
          accountId,
          transactionId: "08820421-8472-4254-8608-f0d59e3b0a87",
          accountType: "cash",
          txCode: "DEB",
          date: new Date().toISOString(),
          status: "posted",
          description: "Tesco Stores 1234 Bristol",
          amount: -45.5,
          currency: "GBP",
          cardPresent: true,
          merchantCategoryCode: "5411",
        },
        {
          userId,
          accountId,
          transactionId: "3c4e27be-17dd-45e2-9b1e-041623daf104",
          accountType: "cash",
          txCode: "DD",
          date: new Date().toISOString(),
          status: "posted",
          description: "Netflix",
          amount: -15.99,
          currency: "GBP",
          meta: {
            "hello": "world",
          },
        },
      ]

      response = await moneyhub.caasEnrichTransactions({transactions: transactionsPayload})

      const spec = await fetchOpenApiSpec(this.config.caas.openapiUrl)
      const reqValidator = createRequestValidator(spec, "/transactions/enrich", "post")
      const resValidator = createResponseValidator(spec, "/transactions/enrich", "post", "201")
      if (!reqValidator || !resValidator) throw new Error("OpenAPI schema missing for POST /transactions/enrich")
      validateRequest = reqValidator
      validateResponse = resValidator
    })

    it("request payload matches OpenAPI TransactionPost schema", function() {
      assertMatchesOpenApi(validateRequest, transactionsPayload, "Request body")
    })

    it("response matches OpenAPI 201 schema", function() {
      assertMatchesOpenApi(validateResponse, response, "Response")
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

    it("card-present transaction receives geotags", function() {
      const first = response.data[0]

      expect(first.mhInsights).to.have.property("geotags")
      expect(first.mhInsights.geotags).to.be.an("array").with.lengthOf(3)
    })

    it("meta is returned intact on enriched transaction", function() {
      const second = response.data[1]

      expect(second).to.have.property("meta")
      expect(second.meta).to.deep.equal({hello: "world"})
    })
  })

  describe("TypeScript types match OpenAPI schemas", function() {
    this.timeout(30000)

    let spec: Awaited<ReturnType<typeof fetchOpenApiSpec>>

    before(async function() {
      spec = await fetchOpenApiSpec(this.config.caas.openapiUrl)
    })

    it("CaasTransactionInput matches OpenAPI TransactionPost definition", function() {
      assertTypeMatchesOpenApi({tsType: "CaasTransactionInput", tsFile: TYPES_FILE, openApiSchemaName: "TransactionPost", spec})
    })

    it("CaasTransaction matches OpenAPI EnrichedTransaction definition", function() {
      assertTypeMatchesOpenApi({tsType: "CaasTransaction", tsFile: TYPES_FILE, openApiSchemaName: "EnrichedTransaction", spec})
    })
  })
})
