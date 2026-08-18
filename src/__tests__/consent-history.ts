import {expect} from "chai"

import {Moneyhub, MoneyhubInstance} from ".."

describe("Consent history", function() {
  let moneyhub: MoneyhubInstance
  let userId: string

  before(async function() {
    moneyhub = await Moneyhub(this.config)
    userId = this.config.testUserId
  })

  it("can get consent history for the test user", async function() {
    try {
      const result = await moneyhub.getConsentHistory({userId})
      expect(result).to.have.property("data")
      expect(Array.isArray(result.data)).to.be.true
    } catch (e: any) {
      if (e.message?.includes("invalid_scope") || e.error === "invalid_scope") {
        this.skip()
      }
      throw e
    }
  })

  it("can get consent history with limit", async function() {
    try {
      const result = await moneyhub.getConsentHistory({userId, limit: 5})
      expect(result.data.length).to.be.at.most(5)
    } catch (e: any) {
      if (e.message?.includes("invalid_scope") || e.error === "invalid_scope") {
        this.skip()
      }
      throw e
    }
  })
})
