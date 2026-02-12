
import {expect} from "chai"
import {expectTypeOf} from "expect-type"
import {path} from "ramda"

import {Moneyhub, MoneyhubInstance, Transactions} from ".."

const delay = (time: number) => {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}

describe("Transaction Splits", function() {
  let moneyhub: MoneyhubInstance
  let transactionId: string
  let splitId: string
  let accountId: string
  let userId: string
  let splits: Transactions.TransactionSplitPost[]

  beforeEach(async function() {
    accountId = this.config.testAccountId
    userId = this.config.testUserId
    moneyhub = await Moneyhub(this.config)
    splits = [
      {
        categoryId: "std:39577c49-350f-45a4-8ec3-48ce205585fb",
        amount: -1500,
        description: "Split 1",
      },
      {
        categoryId: "std:7daf3d79-98dd-4c85-b3cc-6d7ffd83fce9",
        amount: -800,
        description: "Split 2",
      },
    ]

    const transaction: Transactions.TransactionPost = {
      accountId,
      amount: {
        value: -2300,
      },
      categoryId: "std:4b0255f0-0309-4509-9e05-4b4e386f9b0d",
      categoryIdConfirmed: true,
      longDescription: "New transaction",
      shortDescription: "transaction",
      notes: "notes",
      status: "posted",
      date: "2018-07-10T12:00:00+00:00",
    }

    const {data: {id}} = await moneyhub.addTransaction({userId, transaction})
    transactionId = id
    await delay(500)
    const {data} = await moneyhub.splitTransaction({userId, transactionId, splits})
    splitId = data[0].id
    await delay(500)
  })

  afterEach(async function() {
    await moneyhub.deleteTransaction({userId, transactionId})
  })

  it("can split a transaction", async function() {
    const {data} = await moneyhub.splitTransaction({userId, transactionId, splits})

    expect(data).to.have.length(2)
    expectTypeOf<Transactions.TransactionSplit[]>(data)
  })

  it("can get a transactions splits", async function() {
    const {data} = await moneyhub.getTransactionSplits({
      userId,
      transactionId,
    })
    expect(data).to.have.length(2)
    expect(path([0, "amount", "value"], data)).to.be.oneOf([-1500, -800])
    expect(path([0, "description"], data)).to.be.oneOf(["Split 1", "Split 2"])
    expectTypeOf<Transactions.TransactionSplit[]>(data)
  })

  it("can update a transactions splits", async function() {
    const {data} = await moneyhub.patchTransactionSplit({
      userId,
      transactionId,
      splitId,
      split: {
        description: "New Description",
      },
    })
    expect(data).to.have.length(2)
    expect(path([0, "description"], data)).to.equal("New Description")
    expectTypeOf<Transactions.TransactionSplit[]>(data)
  })

  it("can delete a transactions splits", async function() {
    const status = await moneyhub.deleteTransactionSplits({
      userId,
      transactionId,
    })

    expect(status).to.eql(204)
  })
})
