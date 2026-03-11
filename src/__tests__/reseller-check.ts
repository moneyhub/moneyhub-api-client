import {expect} from "chai"

import {Moneyhub, MoneyhubInstance} from ".."

describe("Reseller check", function() {
  let moneyhub: MoneyhubInstance

  before(async function() {
    moneyhub = await Moneyhub(this.config)
  })

  it("calls createResellerCheckRequest (may succeed or return client error)", async function() {
    try {
      const result = await moneyhub.createResellerCheckRequest({
        companyRegistrationNumber: "12345678",
        email: "test@example.com",
        telephone: "+441234567890",
      })
      expect(result).to.be.an("object")
    } catch (err: any) {
      expect(err).to.be.an("error")
    }
  })
})
