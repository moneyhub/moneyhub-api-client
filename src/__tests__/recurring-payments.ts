import {expect} from "chai"

import {Moneyhub, MoneyhubInstance} from ".."

describe("Recurring payments", function() {
  let moneyhub: MoneyhubInstance

  before(async function() {
    moneyhub = await Moneyhub(this.config)
  })

  it("can get recurring payments list", async function() {
    try {
      const result = await moneyhub.getRecurringPayments()
      expect(result).to.have.property("data")
      expect(Array.isArray(result.data)).to.be.true
    } catch (e: any) {
      if (e.message?.includes("invalid_scope") || e.error === "invalid_scope") {
        this.skip()
      }
      throw e
    }
  })

  it("can get recurring payments with params", async function() {
    try {
      const result = await moneyhub.getRecurringPayments({limit: 5})
      expect(result.data.length).to.be.at.most(5)
    } catch (e: any) {
      if (e.message?.includes("invalid_scope") || e.error === "invalid_scope") {
        this.skip()
      }
      throw e
    }
  })
})
