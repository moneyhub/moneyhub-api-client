/* eslint-disable max-nested-callbacks */
const {Moneyhub} = require("..")
const {expect} = require("chai")

describe("Payments", () => {
  let config
  let moneyhub
  let paymentId

  before(async function() {
    config = this.config
    moneyhub = await Moneyhub(config)
  })

  it("gets payment from token", async () => {
    const {data: payment} = await moneyhub.getPaymentFromIDToken({
      idToken: config.testPaymentIdToken,
    })
    paymentId = payment.id
    expect(paymentId).to.be.a("string")
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
