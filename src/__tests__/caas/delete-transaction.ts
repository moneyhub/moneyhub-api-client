/* eslint-disable max-nested-callbacks */
import {expect} from "chai"

import {Moneyhub, MoneyhubInstance} from "../.."
import type {CaasTransactionInput} from "../../requests/caas/types/transactions"

const UNIQUE_USER_ID = "de1e7e00-0001-4000-8000-000000000001"
const UNIQUE_ACCOUNT_ID = "de1e7e00-0001-4000-8000-000000000002"
const UNIQUE_TRANSACTION_ID = "de1e7e00-0001-4000-8000-000000000003"

describe("DELETE /accounts/{accountId}/transactions/{transactionId}", function() {
  let moneyhub: MoneyhubInstance

  before(async function() {
    moneyhub = await Moneyhub(this.config)
  })

  describe("enriches a unique transaction and then deletes it", function() {
    this.timeout(30000)

    let deleteStatus: number
    let postDeleteList: Awaited<ReturnType<typeof moneyhub.caasGetTransactions>>

    before(async function() {
      const uniqueTransaction: CaasTransactionInput = {
        userId: UNIQUE_USER_ID,
        accountId: UNIQUE_ACCOUNT_ID,
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

      deleteStatus = await moneyhub.caasDeleteTransaction({
        accountId: UNIQUE_ACCOUNT_ID,
        transactionId: UNIQUE_TRANSACTION_ID,
      })

      postDeleteList = await moneyhub.caasGetTransactions({
        userId: UNIQUE_USER_ID,
        accountId: UNIQUE_ACCOUNT_ID,
        limit: 1000,
      })
    })

    it("responds with 204 No Content", function() {
      expect(deleteStatus).to.equal(204)
    })

    it("the deleted transactionId no longer appears in GET /transactions", function() {
      const returnedIds = postDeleteList.data.map((t) => t.transactionId)

      expect(returnedIds).to.not.include(UNIQUE_TRANSACTION_ID)
    })
  })
})
