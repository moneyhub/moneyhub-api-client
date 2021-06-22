/* eslint-disable max-nested-callbacks */
const Moneyhub = require("..")
const config = require("../../test/test-client-config")
const {expect} = require("chai")
const querystring = require("querystring")

const bankId = "1ffe704d39629a929c8e293880fb449a"
const state = "sample-state"
const nonce = "sample-nonce"

const parseJwt = (token) => {
  const base64String = token.split(".")[1]
  const decodedValue = JSON.parse(Buffer.from(base64String,
    "base64").toString("ascii"))
  return decodedValue
}

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

    const {request} = querystring.parse(url)
    const payload = parseJwt(request)

    expect(url).to.be.a("string")
    expect(payload).to.not.have.nested.property("claims.id_token.mh:consent.value.permissions")
  })

  it("gets a basic auth url with permissions", async () => {
    const url = await moneyhub.getAuthorizeUrl({
      state,
      nonce,
      scope: `openid id:${bankId} accounts:read`,
      permissions: ["permission-1"]
    })

    const {request} = querystring.parse(url)
    const payload = parseJwt(request)

    expect(url).to.be.a("string")
    expect(payload).to.have.deep.nested.property("claims.id_token.mh:consent.value.permissions", ["permission-1"])
  })

  it("gets an auth url for a user", async () => {
    const url = await moneyhub.getAuthorizeUrlForCreatedUser({
      state,
      nonce,
      bankId,
      userId: "some-user-id",
    })

    const {request} = querystring.parse(url)
    const payload = parseJwt(request)

    expect(url).to.be.a("string")
    expect(payload).to.not.have.nested.property("claims.id_token.mh:consent.value.permissions")
  })

  it("gets an auth url for a user with extra permissions", async () => {
    const url = await moneyhub.getAuthorizeUrlForCreatedUser({
      state,
      nonce,
      bankId,
      userId: "some-user-id",
      permissions: ["permission-1"]
    })

    const {request} = querystring.parse(url)
    const payload = parseJwt(request)

    expect(url).to.be.a("string")
    expect(payload).to.have.deep.nested.property("claims.id_token.mh:consent.value.permissions", ["permission-1"])
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
