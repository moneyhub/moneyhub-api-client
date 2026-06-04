/* eslint-disable max-nested-callbacks */
import {expect} from "chai"

import {Moneyhub, MoneyhubInstance} from "../.."
import type {CaasTransactionInput} from "../../requests/caas/types/transactions"

const UNIQUE_USER_ID = "de1e7e00-0002-4000-8000-000000000001"
const UNIQUE_ACCOUNT_ID = "de1e7e00-0002-4000-8000-000000000002"
const UNIQUE_TRANSACTION_ID = "de1e7e00-0002-4000-8000-000000000003"

describe("DELETE /accounts/{accountId}/transactions/{transactionId}/splits", function() {
  let moneyhub: MoneyhubInstance

  before(async function() {
    moneyhub = await Moneyhub(this.config)
  })

  describe("puts splits then deletes them", function() {
    this.timeout(30000)

    let deleteStatus: number

    before(async function() {
      if (this.skipTestsRequiringCaasIds) {
        this.skip()
      }

      const uniqueTransaction: CaasTransactionInput = {
        userId: UNIQUE_USER_ID,
        accountId: UNIQUE_ACCOUNT_ID,
        transactionId: UNIQUE_TRANSACTION_ID,
        accountType: "cash",
        txCode: "DEB",
        date: new Date().toISOString(),
        status: "posted",
        description: "Unique Splits Delete Target Ltd",
        amount: -60,
        currency: "GBP",
      }

      await moneyhub.caasEnrichTransactions({transactions: [uniqueTransaction]})

      await moneyhub.caasPutTransactionSplits({
        accountId: UNIQUE_ACCOUNT_ID,
        transactionId: UNIQUE_TRANSACTION_ID,
        splits: [
          {amount: -40, userCategoryId: "22", description: "Food"},
          {amount: -20, userCategoryId: "44", description: "Gift"},
        ],
      })

      deleteStatus = await moneyhub.caasDeleteTransactionSplits({
        accountId: UNIQUE_ACCOUNT_ID,
        transactionId: UNIQUE_TRANSACTION_ID,
      })
    })

    it("responds with 204 No Content", function() {
      expect(deleteStatus).to.equal(204)
    })
  })
})
