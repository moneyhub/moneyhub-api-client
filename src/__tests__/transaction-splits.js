/* eslint-disable max-nested-callbacks */
const Moneyhub = require("..")
const config = require("../../test/test-client-config")
const {expect} = require("chai")
const userId = config.testUserId
const R = require("ramda")
describe("Transaction Splits", () => {
  let moneyhub
  let transaction
  let transactionId
  let splitId
  before(async () => {
    moneyhub = await Moneyhub(config)
    const {data} = await moneyhub.getTransactions({
      userId,
      params: {limit: 1},
    })
    transaction = R.head(data)
    transactionId = transaction.id
  })

  it("can split a transaction", async () => {
    const {data: splits} = await moneyhub.splitTransaction({
      userId,
      transactionId,
      splits: [
        {
          categoryId: "std:39577c49-350f-45a4-8ec3-48ce205585fb",
          amount: transaction.amount.value / 2,
          description: "Split 1"
        },
        {
          categoryId: "std:7daf3d79-98dd-4c85-b3cc-6d7ffd83fce9",
          amount: transaction.amount.value / 2,
          description: "Split 2"
        }
      ]
    })

    expect(splits).to.have.length(2)
  })

  it("can get a transactions splits", async () => {
    const {data: splits} = await moneyhub.getTransactionSplits({
      userId,
      transactionId,
    })
    splitId = R.path([0, "id"], splits)
    expect(splits).to.have.length(2)
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
