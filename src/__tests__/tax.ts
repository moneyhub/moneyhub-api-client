/* eslint-disable max-nested-callbacks */
import {expect} from "chai"
import {expectTypeOf} from "expect-type"

import {Moneyhub, MoneyhubInstance, Taxes} from ".."

describe("Tax", function() {
  let moneyhub: MoneyhubInstance
  let userId: string

  before(async function() {
    userId = this.config.testUserId
    moneyhub = await Moneyhub(this.config)
  })

  it("can get a tax return", async function() {
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
    expectTypeOf<Taxes.Tax>(tax)
  })
})
