import {expect} from "chai"

import {Moneyhub, MoneyhubInstance} from ".."

describe("Standing orders", function() {
  let moneyhub: MoneyhubInstance

  before(async function() {
    moneyhub = await Moneyhub(this.config)
  })

  it("can get standing orders list", async function() {
    const result = await moneyhub.getStandingOrders()
    expect(result).to.have.property("data")
    expect(Array.isArray(result.data)).to.be.true
  })

  it("can get standing orders with params", async function() {
    const result = await moneyhub.getStandingOrders({limit: 10})
    expect(result.data.length).to.be.at.most(10)
  })
})
