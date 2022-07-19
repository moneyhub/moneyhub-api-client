/* eslint-disable max-nested-callbacks */
import {expect} from "chai"
import {expectTypeOf} from "expect-type"

import {Moneyhub, MoneyhubInstance, RegularTransactions} from ".."

describe.skip("Regular transactions", () => {
  let moneyhub: MoneyhubInstance
  let userId: string

  before(async function() {
    userId = this.config.testUserId
    moneyhub = await Moneyhub(this.config)
  })

  it("get regular transactions", async () => {
    const {data} = await moneyhub.getRegularTransactions({userId})
    expect(data.length).to.be.above(0)
    expect(data[0]).to.have.property("seriesId")
    expectTypeOf<RegularTransactions.RegularTransaction[]>(data)
  })

})
