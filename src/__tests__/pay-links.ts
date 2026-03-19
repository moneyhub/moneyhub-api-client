import {expect} from "chai"

import {Moneyhub, MoneyhubInstance} from ".."

describe("Pay links", function() {
  let moneyhub: MoneyhubInstance
  let payeeId: string

  before(async function() {
    moneyhub = await Moneyhub(this.config)
    payeeId = this.config.testPayeeId
  })

  it("can get pay links list", async function() {
    try {
      const result = await moneyhub.getPayLinks()
      expect(result).to.have.property("data")
      expect(Array.isArray(result.data)).to.be.true
    } catch (e: any) {
      if (e.message?.includes("invalid_scope") || e.error === "invalid_scope") {
        this.skip()
      }
      throw e
    }
  })

  it("can add a pay link and retrieve it", async function() {
    try {
      const create = await moneyhub.addPayLink({
        widgetId: "test-widget",
        payeeId,
        reference: "integration-test-ref",
        amount: 100,
        useOnce: true,
      })
      expect(create.data).to.have.property("id")
      expect(create.data.payeeId).to.equal(payeeId)
      expect(create.data.amount).to.equal(100)

      const getOne = await moneyhub.getPayLink({id: create.data.id})
      expect(getOne.data.id).to.equal(create.data.id)
      expect(getOne.data).to.have.property("id")
    } catch (e: any) {
      if (e.message?.includes("invalid_scope") || e.error === "invalid_scope") {
        this.skip()
      }
      throw e
    }
  })
})
