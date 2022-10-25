/* eslint-disable max-nested-callbacks */
import {expect} from "chai"
import {expectTypeOf} from "expect-type"

import {Moneyhub, MoneyhubInstance, Payments} from ".."

describe("Payments", function() {
  let moneyhub: MoneyhubInstance
  let paymentId: string
  let testPaymentIdToken: string

  before(async function() {
    testPaymentIdToken = this.config.testPaymentIdToken
    moneyhub = await Moneyhub(this.config)
  })

  it("gets payment from token", async function() {
    const {data: payment} = await moneyhub.getPaymentFromIDToken({
      idToken: testPaymentIdToken,
    })
    paymentId = payment.id
    expect(paymentId).to.be.a("string")
    expectTypeOf<Payments.Payment>(payment)
  })

  it("gets payment by id", async function() {
    const {data: payment} = await moneyhub.getPayment({
      id: paymentId,
    })
    expect(payment.id).to.eql(paymentId)
    expect(payment.status).to.eql("completed")
    expectTypeOf<Payments.Payment>(payment)
  })

  it("gets payments", async function() {
    const {data: payments} = await moneyhub.getPayments({limit: 1})
    expect(payments.length).to.eql(1)
    expectTypeOf<Payments.Payment[]>(payments)
  })
})
