/* eslint-disable max-nested-callbacks */
const Moneyhub = require("..")
const config = require("../../test/test-client-config")
const {expect} = require("chai")

const userId = config.testUserId

describe("Transactions", () => {
  let moneyhub
  before(async () => {
    moneyhub = await Moneyhub(config)
  })

  it("can get transactions", async () => {
    const {data: transactions} = await moneyhub.getTransactions({
      userId,
    })

    expect(transactions.length).to.be.greaterThan(1)
  })

  it("can get transactions with limit", async () => {
    const {data: transactions} = await moneyhub.getTransactions({
      userId,
      params: {limit: 1},
    })

    expect(transactions.length).to.eql(1)
  })
})
