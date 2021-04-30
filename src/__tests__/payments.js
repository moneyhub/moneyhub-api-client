/* eslint-disable max-nested-callbacks */
const Moneyhub = require("..")
const config = require("../../test/config")
const {expect} = require("chai")

describe("Payments", () => {
  let moneyhub
  let paymentId

  before(async () => {
    moneyhub = await Moneyhub(config)
  })

  it("gets payment from token", async () => {
    const {data: payment} = await moneyhub.getPaymentFromIDToken({
      idToken: config.testPaymentIdToken,
    })
    paymentId = payment.id
    expect(paymentId).to.eql("2f1b0cec-d231-4c3b-8f6c-0f9ad330e939")
  })

  it("gets payment by id", async () => {
    const {data: payment} = await moneyhub.getPayment({
      id: paymentId
    })
    expect(payment.id).to.eql(paymentId)
    expect(payment.status).to.eql("completed")
  })

  it("gets payments", async () => {
    const {data: payments} = await moneyhub.getPayments({limit: 1})
    expect(payments.length).to.eql(1)
  })
})
