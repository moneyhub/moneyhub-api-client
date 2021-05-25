/* eslint-disable max-nested-callbacks */
const Moneyhub = require("..")
const config = require("../../test/test-client-config")
const {expect} = require("chai")

describe("Auth requests", () => {
  let moneyhub

  before(async () => {
    moneyhub = await Moneyhub(config)
  })

  it("creates payment auth request", async () => {
    const {testPayeeId} = config
    const {data} = await moneyhub.createAuthRequest({
      scope: "openid payment id:b74f1a79f0be8bdb857d82d0f041d7d2",
      payment: {
        payeeId: testPayeeId,
        amount: 15,
        payeeRef: "Payee ref",
        payerRef: "Payer ref",
      },
      redirectUri: config.client.redirect_uri,
    })
    expect(data).to.have.property("id")
    expect(data).to.have.property("status", "pending")
    expect(data).to.have.property("redirectParams")
    expect(data.redirectParams).to.have.property("authUrl")
    expect(data.redirectParams).to.have.property("returnUrl")
    expect(data.redirectParams).to.have.property("state")

  })
})
