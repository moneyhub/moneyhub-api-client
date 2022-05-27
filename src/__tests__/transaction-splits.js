/* eslint-disable max-nested-callbacks */
const {Moneyhub} = require("..")
const config = require("../../test/test-client-config")
const {expect} = require("chai")
const {testUserId: userId, testAccountId: accountId} = config
const R = require("ramda")

describe("Transaction Splits", () => {
  let moneyhub
  let transactionId
  let splitId

  const splitTestBaseInput = {
    userId,
    splits: [
      {
        categoryId: "std:39577c49-350f-45a4-8ec3-48ce205585fb",
        amount: -1500,
        description: "Split 1"
      },
      {
        categoryId: "std:7daf3d79-98dd-4c85-b3cc-6d7ffd83fce9",
        amount: -800,
        description: "Split 2"
      }
    ]
  }

  before(async () => {
    moneyhub = await Moneyhub(config)
    const transaction = {
      accountId,
      "amount": {
        "value": -2300
      },
      "categoryId": "std:4b0255f0-0309-4509-9e05-4b4e386f9b0d",
      "categoryIdConfirmed": true,
      "longDescription": "New transaction",
      "shortDescription": "transaction",
      "notes": "notes",
      "status": "posted",
      "date": "2018-07-10T12:00:00+00:00"
    }

    const {data} = await moneyhub.addTransaction({userId, transaction})
    transactionId = data.id
  })

  beforeEach(async () => {
    const {data} = await moneyhub.splitTransaction({...splitTestBaseInput, transactionId})
    splitId = data[0].id
  })

  after(async () => {
    await moneyhub.deleteTransaction({userId, transactionId})
  })

  it("can split a transaction", async () => {
    const {data: splits} = await moneyhub.splitTransaction({...splitTestBaseInput, transactionId})

    expect(splits).to.have.length(2)
  })

  it("can get a transactions splits", async () => {
    const {data: splits} = await moneyhub.getTransactionSplits({
      userId,
      transactionId,
    })
    expect(splits).to.have.length(2)
    expect(R.path([0, "amount", "value"], splits)).to.be.oneOf([-1500, -800])
    expect(R.path([0, "description"], splits)).to.be.oneOf(["Split 1", "Split 2"])
  })

  it("can update a transactions splits", async () => {
    const {data: splits} = await moneyhub.patchTransactionSplit({
      userId,
      transactionId,
      splitId,
      split: {
        description: "New Description"
      }
    })
    expect(splits).to.have.length(2)
    expect(R.path([0, "description"], splits)).to.equal("New Description")
  })

  it("can delete a transactions splits", async () => {
    const status = await moneyhub.deleteTransactionSplits({
      userId,
      transactionId,
    })

    expect(status).to.eql(204)
  })
})
