/* eslint-disable max-nested-callbacks */
const {Moneyhub} = require("..")
const {expect} = require("chai")

describe.skip("Regular transactions", () => {
  let config
  let moneyhub
  let userId

  before(async function() {
    config = this.config
    userId = config.testUserId
    moneyhub = await Moneyhub(config)
  })

  it("get regular transactions", async () => {
    const {data} = await moneyhub.getRegularTransactions({userId})
    expect(data.length).to.be.above(0)
    expect(data[0]).to.have.property("seriesId")
  })

})
