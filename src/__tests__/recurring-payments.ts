/* eslint-disable max-nested-callbacks */
import {expect} from "chai"
import {expectTypeOf} from "expect-type"

import {Moneyhub, MoneyhubInstance, Payments} from ".."

describe("Recurring Payments", function() {
  let moneyhub: MoneyhubInstance
  let testRecurringPaymentId: string

  before(async function() {
    // Use a test recurring payment ID from config if available
    testRecurringPaymentId = this.config.testRecurringPaymentId || "test-recurring-payment-id"
    moneyhub = await Moneyhub(this.config)
  })

  it("confirms funds for recurring payment", async function() {
    const fundsConfirmation = {
      amount: "10.00",
      currency: "GBP",
    }

    const {data: confirmation} = await moneyhub.confirmFundsForRecurringPayment({
      recurringPaymentId: testRecurringPaymentId,
      fundsConfirmation,
    })

    expect(confirmation).to.be.an("object")
    expect(confirmation.fundsAvailable).to.be.a("boolean")
    expect(confirmation.fundsAvailableAt).to.be.a("string")
    expect(confirmation.amount).to.eql("10.00")
    expect(confirmation.currency).to.eql("GBP")
    expect(confirmation.recurringPaymentId).to.be.a("string")

    expectTypeOf<Payments.FundsConfirmationResponse>(confirmation)
  })
})

