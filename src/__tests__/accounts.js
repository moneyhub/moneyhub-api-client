/* eslint-disable max-nested-callbacks */
const {Moneyhub} = require("..")
const config = require("../../test/test-client-config")
const {expect} = require("chai")

describe("Accounts", () => {
  let manualAccountId, moneyhub
  const {testUserId: userId, testAccountId: accountId, testPensionId: pensionId} = config

  before(async () => {
    moneyhub = await Moneyhub(config)
  })

  it("get accounts", async () => {
    const accounts = await moneyhub.getAccounts({userId})
    expect(accounts.data.length).to.be.at.least(11)
    const cashAccount = accounts.data.find(a => a.type === "cash:current")
    const pension = accounts.data.find(a => a.type === "pension")

    expect(cashAccount).to.not.be.undefined
    expect(pension).to.not.be.undefined
  })

  it("get account", async () => {
    const {data: account} = await moneyhub.getAccount({userId, accountId})
    expect(account.id).to.eql(accountId)
  })

  it("get counterparties", async () => {
    const {data: counterparties} = await moneyhub.getAccountCounterparties({
      userId,
      accountId
    })
    expect(counterparties.length).to.be.greaterThan(10)
  })

  it("get holdings", async () => {
    const {data: holdings} = await moneyhub.getAccountHoldings({
      userId,
      accountId: pensionId
    })
    expect(holdings[0].items.length).to.be.greaterThan(5)
  })

  xit("get recurring transactions", async () => {
    const {data: recurring} = await moneyhub.getAccountRecurringTransactions({
      userId,
      accountId
    })
    expect(recurring.length).to.be.greaterThan(10)
  })

  it("creates a manual account", async () => {
    const account = {
      "accountName": "Account name",
      "providerName": "Provider name",
      "type": "cash:current",
      "accountType": "personal",
      "balance": {
        "date": "2018-08-12",
        "amount": {
          "value": 300023
        }
      }
    }

    const {data: {id}} = await moneyhub.createAccount({userId, account})
    manualAccountId = id
    expect(id).to.not.be.undefined
  })

  it("deletes manual account", async () => {
    const status = await moneyhub.deleteAccount({userId, accountId: manualAccountId})
    expect(status).to.eql(204)
  })
})
