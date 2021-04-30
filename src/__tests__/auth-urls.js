/* eslint-disable max-nested-callbacks */
const Moneyhub = require("..")
const config = require("../../test/test-client-config")
const {expect} = require("chai")

const bankId = "1ffe704d39629a929c8e293880fb449a"
const state = "sample-state"
const nonce = "sample-nonce"

describe("Auth Urls", () => {
  let moneyhub

  before(async () => {
    moneyhub = await Moneyhub(config)
  })

  it("gets a basic auth url", async () => {
    const url = await moneyhub.getAuthorizeUrl({
      state,
      nonce,
      scope: `openid id:${bankId} accounts:read`,
    })

    expect(url).to.be.a("string")
  })

  it("gets an auth url for a user", async () => {
    const url = await moneyhub.getAuthorizeUrlForCreatedUser({
      state,
      nonce,
      bankId,
      userId: "some-user-id",
    })

    expect(url).to.be.a("string")
  })

  it("gets a payment auth url", async () => {
    const payee = await moneyhub.addPayee({
      accountNumber: "12345678",
      sortCode: "123456",
      name: "Test",
    })

    const url = await moneyhub.getPaymentAuthorizeUrl({
      bankId,
      payeeId: payee.data.id,
      amount: 1,
      payeeRef: "some-ref",
      payerRef: "another-ref",
      state,
      nonce,
    })

    expect(url).to.be.a("string")
  })
})
