/* eslint-disable max-nested-callbacks */
import {expect} from "chai"

import {Moneyhub, MoneyhubInstance} from "../.."
import type {CaasTransactionInput} from "../../requests/caas/types/transactions"

const UNIQUE_USER_ID = "de1e7e00-0003-4000-8000-000000000001"
const UNIQUE_ACCOUNT_ID = "de1e7e00-0003-4000-8000-000000000002"
const UNIQUE_TRANSACTION_ID = "de1e7e00-0003-4000-8000-000000000003"

describe("DELETE /users/{userId}", function() {
  let moneyhub: MoneyhubInstance

  before(async function() {
    moneyhub = await Moneyhub(this.config)
  })

  describe("enriches a transaction under a unique userId and then deletes the user", function() {
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
        description: "Unique Delete User Target Ltd",
        amount: -2.34,
        currency: "GBP",
      }

      await moneyhub.caasEnrichTransactions({transactions: [uniqueTransaction]})

      deleteStatus = await moneyhub.caasDeleteUser({userId: UNIQUE_USER_ID})

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

    it("GET /transactions for the deleted user responds with 404", function() {
      expect(getError).to.be.an("Error")
      expect((getError as Error).message).to.include("404")
    })
  })
})
