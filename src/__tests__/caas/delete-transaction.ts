/* eslint-disable max-nested-callbacks */
import {expect} from "chai"

import {Moneyhub, MoneyhubInstance} from "../.."
import type {CaasTransactionInput} from "../../requests/caas/types/transactions"
const UNIQUE_TRANSACTION_ID = "de1e7e00-0001-4000-8000-000000000001"

describe("DELETE /accounts/{accountId}/transactions/{transactionId}", function() {
  let moneyhub: MoneyhubInstance

  before(async function() {
    moneyhub = await Moneyhub(this.config)
  })

  describe("enriches a unique transaction and then deletes it", function() {
    this.timeout(30000)

    let postDeleteList: Awaited<ReturnType<typeof moneyhub.caasGetTransactions>>

    before(async function() {
      if (this.skipTestsRequiringUserId || this.skipTestsRequiringAccountId) {
        this.skip()
      }

      const {caas: {userId, accountId}} = this.config

      const uniqueTransaction: CaasTransactionInput = {
        userId,
        accountId,
        transactionId: UNIQUE_TRANSACTION_ID,
        accountType: "cash",
        txCode: "DEB",
        date: new Date().toISOString(),
        status: "posted",
        description: "Unique Delete Target Ltd",
        amount: -9.99,
        currency: "GBP",
      }

      await moneyhub.caasEnrichTransactions({transactions: [uniqueTransaction]})

      await moneyhub.caasDeleteTransaction({
        accountId,
        transactionId: UNIQUE_TRANSACTION_ID,
      })

      postDeleteList = await moneyhub.caasGetTransactions({userId, accountId, limit: 1000})
    })

    it("the deleted transactionId no longer appears in GET /transactions", function() {
      const returnedIds = postDeleteList.data.map((t) => t.transactionId)

      expect(returnedIds).to.not.include(UNIQUE_TRANSACTION_ID)
    })
  })
})
