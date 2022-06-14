/* eslint-disable max-nested-callbacks */
const {Moneyhub} = require("..")
const {expect} = require("chai")

describe("Auth requests", () => {
  let config, moneyhub, userId

  before(async function() {
    config = this.config
    moneyhub = await Moneyhub(config)
  })

  after(async () => {
    await moneyhub.deleteUser({userId})
  })

  it("creates payment auth request", async () => {
    const {testPayeeId} = config
    const {data} = await moneyhub.createAuthRequest({
      scope: "openid payment id:1ffe704d39629a929c8e293880fb449a",
      payment: {
        payeeId: testPayeeId,
        amount: 15,
        payeeRef: "Payee ref",
        payerRef: "Payer ref",
      },
      redirectUri: config.client.redirect_uri,
    })
    userId = data.userId
    expect(data).to.have.property("id")
    expect(data).to.have.property("status", "pending")
    expect(data).to.have.property("redirectParams")
    expect(data.redirectParams).to.have.property("authUrl")
    expect(data.redirectParams).to.have.property("returnUrl")
    expect(data.redirectParams).to.have.property("state")

  })
})
