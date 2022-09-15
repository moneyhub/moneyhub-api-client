/* eslint-disable max-nested-callbacks */
import {expect} from "chai"
import {expectTypeOf} from "expect-type"

import {Moneyhub, MoneyhubInstance, Accounts, Counterparties, Holdings, Transactions} from ".."

describe("Accounts", () => {
  let accountId: string,
    accountIdWithCounterparties: string,
    manualAccountId: string,
    moneyhub: MoneyhubInstance,
    pensionId: string,
    readOnlyUserId: string,
    userId: string

  before(async function() {
    const {
      testUserId,
      testAccountId,
      readOnlyPensionId,
      readOnlyAccountIdWithCounterparties,
      testReadOnlyUserId,
    } = this.config
    accountId = testAccountId
    userId = testUserId
    readOnlyUserId = testReadOnlyUserId
    accountIdWithCounterparties = readOnlyAccountIdWithCounterparties
    pensionId = readOnlyPensionId
    moneyhub = await Moneyhub(this.config)
  })

  it("get accounts", async () => {
    const accounts = await moneyhub.getAccounts({userId})
    expect(accounts.data.length).to.be.at.least(2)
    const cashAccount = accounts.data.find(a => a.type === "cash:current")
    const pension = accounts.data.find(a => a.type === "pension")

    expect(cashAccount).to.not.be.undefined
    expect(pension).to.not.be.undefined
    expectTypeOf<Accounts.Account[]>(accounts.data)
  })

  it("get account", async () => {
    const {data: account} = await moneyhub.getAccount({userId, accountId})
    expect(account.id).to.eql(accountId)
    expectTypeOf<Accounts.Account>(account)
  })

  it("get counterparties", async () => {
    const {data: counterparties} = await moneyhub.getAccountCounterparties({
      userId: readOnlyUserId,
      accountId: accountIdWithCounterparties,
      params: {
        counterpartiesVersion: "v2",
      },
    })
    expect(counterparties.length).to.be.greaterThan(6)
    expectTypeOf<Counterparties.Counterparty[]>(counterparties)
  })

  it("get holdings", async () => {
    const {data: holdings} = await moneyhub.getAccountHoldings({
      userId: readOnlyUserId,
      accountId: pensionId,
    })
    expect(holdings[0].items.length).to.be.greaterThan(1)
    expectTypeOf<Holdings.HoldingsValuation[]>(holdings)
  })

  xit("get recurring transactions", async () => {
    const {data: recurring} = await moneyhub.getAccountRecurringTransactions({
      userId,
      accountId,
    })
    expect(recurring.length).to.be.greaterThan(10)
    expectTypeOf<Transactions.RecurringTransactionEstimate[]>(recurring)
  })

  it("creates a manual account", async () => {
    const account: Accounts.AccountPost = {
      accountName: "Account name",
      providerName: "Provider name",
      type: "cash:current",
      accountType: "personal",
      balance: {
        date: "2018-08-12",
        amount: {
          value: 300023,
          currency: "GBP",
        },
      },
    }

    const {data} = await moneyhub.createAccount({userId, account})
    manualAccountId = data.id
    expect(data.id).to.not.be.undefined
    expectTypeOf<Accounts.Account>(data)
  })

  it("deletes manual account", async () => {
    const status = await moneyhub.deleteAccount({userId, accountId: manualAccountId})
    expect(status).to.eql(204)
  })
})
