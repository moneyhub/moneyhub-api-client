/* eslint-disable max-nested-callbacks */
import {expect} from "chai"

import {Moneyhub, MoneyhubInstance} from "../.."
import type {CaasTransactionInput} from "../../requests/caas/types/transactions"

const UNIQUE_USER_ID = "de1e7e00-0002-4000-8000-000000000001"
const UNIQUE_ACCOUNT_ID = "de1e7e00-0002-4000-8000-000000000002"
const UNIQUE_TRANSACTION_ID = "de1e7e00-0002-4000-8000-000000000003"

describe("DELETE /accounts/{accountId}", function() {
  let moneyhub: MoneyhubInstance

  before(async function() {
    moneyhub = await Moneyhub(this.config)
  })

  describe("enriches a transaction under a unique accountId and then deletes the account", function() {
    this.timeout(30000)

    let deleteStatus: number
    let getError: unknown

    before(async function() {
      const uniqueTransaction: CaasTransactionInput = {
        userId: UNIQUE_USER_ID,
        accountId: UNIQUE_ACCOUNT_ID,
        transactionId: UNIQUE_TRANSACTION_ID,
        accountType: "cash",
        txCode: "DEB",
        date: new Date().toISOString(),
        status: "posted",
        description: "Unique Delete Account Target Ltd",
        amount: -1.23,
        currency: "GBP",
      }

      await moneyhub.caasEnrichTransactions({transactions: [uniqueTransaction]})

      deleteStatus = await moneyhub.caasDeleteAccount({accountId: UNIQUE_ACCOUNT_ID})

      try {
        await moneyhub.caasGetTransactions({
          userId: UNIQUE_USER_ID,
          accountId: UNIQUE_ACCOUNT_ID,
          limit: 1000,
        })
      } catch (err) {
        getError = err
      }
    })

    it("responds with 204 No Content", function() {
      expect(deleteStatus).to.equal(204)
    })

    it("GET /transactions for the deleted account responds with 404", function() {
      expect(getError).to.be.an("Error")
      expect((getError as Error).message).to.include("404")
    })
  })
})
