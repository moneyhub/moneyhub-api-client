
import {expect} from "chai"
import {expectTypeOf} from "expect-type"

import {Moneyhub, MoneyhubInstance, Payees} from ".."

describe("Payees", function() {
  let moneyhub: MoneyhubInstance
  let payeeId: string

  before(async function() {
    moneyhub = await Moneyhub(this.config)
  })

  it("add payee", async function() {
    const payee = await moneyhub.addPayee({
      accountNumber: "12345678",
      sortCode: "123456",
      name: "Test",
    })
    expect(payee.data.accountNumber).to.eql("12345678")
    expectTypeOf<Payees.Payee>(payee.data)
    payeeId = payee.data.id
  })

  it("get payee", async function() {
    const payee = await moneyhub.getPayee({
      id: payeeId,
    })
    expect(payee.data.accountNumber).to.eql("12345678")
    expect(payee.data.id).to.eql(payeeId)
    expectTypeOf<Payees.Payee>(payee.data)
  })

  it("get payees", async function() {
    const payees = await moneyhub.getPayees({
      limit: 1,
    })
    expect(payees.data.length).to.eql(1)
    expect(payees.data[0].name).to.be.a("string")
    expectTypeOf<Payees.Payee[]>(payees.data)
  })
})
