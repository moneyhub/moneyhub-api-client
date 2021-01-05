/* eslint-disable max-nested-callbacks */
const Moneyhub = require("..")
const config = require("../../examples/config.local")
const {expect} = require("chai")

describe("Payments", () => {
  let moneyhub
  let paymentId

  before(async () => {
    moneyhub = await Moneyhub(config)
  })

  it("gets payment from token", async () => {
    const payment = await moneyhub.getPaymentFromIDToken({
      idToken: config.testPaymentIdToken,
    })
    paymentId = payment.data.id
    expect(payment.data.status).to.eql("completed")
  })

  it("gets payment by id", async () => {
    const payment = await moneyhub.getPayment({
      id: paymentId
    })
    expect(payment.data.id).to.eql(paymentId)
    expect(payment.data.status).to.eql("completed")
  })

  it("gets payments", async () => {
    const {data: payments} = await moneyhub.getPayments({limit: 1})
    expect(payments.length).to.eql(1)
  })
})
