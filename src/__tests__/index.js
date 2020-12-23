const Moneyhub = require("../")
const config = require("../../examples/config")
const {expect} = require("chai")

/


describe("API client", function() {
  describe("Client configuration", () => {
    it("should create client", async () => {
      const moneyhub = await Moneyhub(config)
      expect(moneyhub).to.be.an("object")
    })
  })
})
