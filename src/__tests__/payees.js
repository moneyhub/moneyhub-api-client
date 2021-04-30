/* eslint-disable max-nested-callbacks */
const Moneyhub = require("..")
const config = require("../../test/test-client-config")
const {expect} = require("chai")

describe("Payees", () => {
  let moneyhub
  let payeeId

  before(async () => {
    moneyhub = await Moneyhub(config)
  })

  it("add payee", async () => {
    const payee = await moneyhub.addPayee({
      accountNumber: "12345678",
      sortCode: "123456",
      name: "Test",
    })
    expect(payee.data.accountNumber).to.eql("12345678")
    payeeId = payee.data.id
  })

  it("get payee", async () => {
    const payee = await moneyhub.getPayee({
      id: payeeId,
    })
    expect(payee.data.accountNumber).to.eql("12345678")
    expect(payee.data.id).to.eql(payeeId)
  })

  it("get payees", async () => {
    const payees = await moneyhub.getPayees({
      limit: 1,
    })
    expect(payees.data.length).to.eql(1)
    expect(payees.data[0].name).to.be.a("string")
  })
})
