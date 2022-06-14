/* eslint-disable max-nested-callbacks */
const {Moneyhub} = require("..")
const {expect} = require("chai")

describe("Tax", () => {
  let config
  let moneyhub
  let userId
  before(async function() {
    config = this.config
    userId = config.testUserId
    moneyhub = await Moneyhub(config)
  })

  it("can get a tax return", async () => {
    const startDate = "2019-01-01"
    const endDate = "2020-01-01"
    const {data: tax} = await moneyhub.getTaxReturn({
      userId,
      params: {
        startDate,
        endDate,
      },
    })

    expect(tax.dateTo).to.eql(endDate)
    expect(tax.dateFrom).to.eql(startDate)
    expect(tax.taxReturn.sa105).to.be.an("object")
  })
})
