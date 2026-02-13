
import {expect} from "chai"
import {expectTypeOf} from "expect-type"
import {AccountBalancePost, AccountPatch} from "src/schema/account"

import {Moneyhub, MoneyhubInstance, Accounts, Counterparties, Holdings, Transactions} from ".."

describe("Accounts", function() {
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

  it("get accounts", async function() {
    const accounts = await moneyhub.getAccounts({userId})
    expect(accounts.data.length).to.be.at.least(2)
    const cashAccount = accounts.data.find(a => a.type === "cash:current")
    const pension = accounts.data.find(a => a.type === "pension")

    expect(cashAccount).to.not.be.undefined
    expect(pension).to.not.be.undefined
    expectTypeOf<Accounts.Account[]>(accounts.data)
  })

  it("get accounts list", async function() {
    const accounts = await moneyhub.getAccountsList({userId}, {version: "v2"})
    expect(accounts.data.length).to.be.at.least(2)
    const cashAccount = accounts.data.find(a => a.type === "cash:current")
    const pension = accounts.data.find(a => a.type === "pension")

    const transactionData = accounts.data.find(a => !!a.transactionData)

    expect(transactionData).to.be.undefined
    expect(cashAccount).to.not.be.undefined
    expect(pension).to.not.be.undefined
    expectTypeOf<Accounts.Account[]>(accounts.data)
  })

  it("get accounts list with transactionData", async function() {
    const accounts = await moneyhub.getAccountsList({userId, params: {showTransactionData: true}}, {version: "v2"})
    expect(accounts.data.length).to.be.at.least(2)
    const cashAccount = accounts.data.find(a => a.type === "cash:current")
    const pension = accounts.data.find(a => a.type === "pension")

    const transactionData = accounts.data.find(a => !!a.transactionData)

    expect(transactionData).to.not.be.undefined
    expect(cashAccount).to.not.be.undefined
    expect(pension).to.not.be.undefined
    expectTypeOf<Accounts.Account[]>(accounts.data)
  })

  it("get accounts list with details", async function() {
    const accounts = await moneyhub.getAccountsListWithDetails({userId}, {version: "v2"})
    expect(accounts.data.length).to.be.at.least(2)
    const cashAccount = accounts.data.find(a => a.type === "cash:current")
    const pension = accounts.data.find(a => a.type === "pension")

    expect(cashAccount).to.not.be.undefined
    expect(pension).to.not.be.undefined
    expectTypeOf<Accounts.Account[]>(accounts.data)
  })

  it("get account", async function() {
    const {data: account} = await moneyhub.getAccount({userId, accountId})
    expect(account.id).to.eql(accountId)
    expectTypeOf<Accounts.Account>(account)
  })

  it("get counterparties", async function() {
    const {data: counterparties} = await moneyhub.getAccountCounterparties({
      userId: readOnlyUserId,
      accountId: accountIdWithCounterparties,
      params: {
        counterpartiesVersion: "v2",
      },
    }, {version: "v2"})
    expect(counterparties.length).to.be.greaterThan(6)
    expectTypeOf<Counterparties.Counterparty[]>(counterparties)
  })

  it("get holdings", async function() {
    const {data: holdings} = await moneyhub.getAccountHoldings({
      userId: readOnlyUserId,
      accountId: pensionId,
    })

    expect(holdings).to.be.an("array")
    if (holdings.length > 0) {
      expect(holdings[0].items.length).to.be.greaterThan(1)

      expectTypeOf<Holdings.HoldingsValuation[]>(holdings)
    }
  })

  it.skip("get recurring transactions", async function() {
    const {data: recurring} = await moneyhub.getAccountRecurringTransactions({
      userId,
      accountId,
    })
    expect(recurring.length).to.be.greaterThan(10)
    expectTypeOf<Transactions.RecurringTransactionEstimate[]>(recurring)
  })

  it("creates a manual account", async function() {
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

  it("creates a new balance", async function() {
    const balance: AccountBalancePost = {
      amount: {
        value: 154700,
      },
      date: "2022-01-01",
    }
    const {data} = await moneyhub.addAccountBalance({userId, accountId: manualAccountId, balance})
    expect(data.amount.value).to.equal(balance.amount.value)
    expectTypeOf<Accounts.AccountBalancePost>(data)
  })

  it("updates an account", async function() {
    const accountPatch: AccountPatch = {
      accountName: "Updated Account Name",
      providerName: "Updated Provider Name",
      details: {
        AER: 14,
      },
    }

    const {data} = await moneyhub.updateAccount({userId, accountId: manualAccountId, account: accountPatch})
    expect(data.accountName).equals("Updated Account Name")
    expect(data.providerName).equals("Updated Provider Name")
    expect(data.details.AER).to.equal(14)
  })

  it("deletes manual account", async function() {
    const status = await moneyhub.deleteAccount({userId, accountId: manualAccountId})
    expect(status).to.eql(204)
  })
})
