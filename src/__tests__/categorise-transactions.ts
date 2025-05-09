/* eslint-disable max-nested-callbacks */
import {expect} from "chai"
import {expectTypeOf} from "expect-type"

import {Moneyhub, MoneyhubInstance, CategorisedTransactions} from ".."

describe.skip("Categorise transactions", function() {
  let moneyhub: MoneyhubInstance

  before(async function() {
    moneyhub = await Moneyhub(this.config)
  })

  describe("creates a request to categorise transactions", function() {
    let response: Awaited<ReturnType<typeof moneyhub.categoriseTransactions>>

    before(async function() {
      response = await moneyhub.categoriseTransactions({
        accountId: "b72f2a5d-c43f-4db1-8143-6f6682ac132c",
        accountType: "cash",
        transactions: [
          {
            id: "b72f2a5d-c43f-4db1-8143-6f6682ac132c",
            description: "Amazon",
            amount: {
              value: -3000,
            },
            date: "2025-05-02T15:50:19.603Z",
            proprietaryTransactionCode: "DEBIT",
            merchantCategoryCode: "OT42",
          },
          {
            id: "b72f2a5d-c43f-4db1-8143-6f6682ac133c",
            description: "Tesco",
            amount: {
              value: -3000,
            },
            date: "2025-05-02T15:50:19.603Z",
            proprietaryTransactionCode: "DEBIT",
            merchantCategoryCode: "OT42",
          },
        ],
      })
    })

    it("categorises a list of transactions", async function() {
      expect(response.data).to.have.property("accountId")
      expect(response.data).to.have.property("accountType")
      expectTypeOf<CategorisedTransactions.CategorisedTransaction[]>(response.data.transactions)
      expectTypeOf<string[]>(response.data.failedCategorisationIds)
    })
  })
})
