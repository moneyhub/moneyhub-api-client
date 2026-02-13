
import {expect} from "chai"
import {expectTypeOf} from "expect-type"

import {Accounts, Moneyhub, MoneyhubInstance, Transactions} from ".."

const delay = (time: number) => {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}

describe("Transactions", function() {
  let moneyhub: MoneyhubInstance
  let transactionId: string
  let userId: string

  before(async function() {
    userId = this.config.testUserId
    moneyhub = await Moneyhub(this.config)
  })

  it("can get transactions", async function() {
    const {data: transactions} = await moneyhub.getTransactions({
      userId,
    })

    expect(transactions.length).to.be.greaterThan(1)
    expectTypeOf<Transactions.Transaction[]>(transactions)
  })

  it("can get transactions with limit", async function() {
    const {data: transactions} = await moneyhub.getTransactions({
      userId,
      params: {limit: 1},
    })

    transactionId = transactions[0].id

    expect(transactions.length).to.eql(1)
    expectTypeOf<Transactions.Transaction[]>(transactions)
  })

  it("can get one transaction", async function() {
    const {data: transaction} = await moneyhub.getTransaction({
      userId,
      transactionId,
    })

    expect(transaction.id).to.equal(transactionId)
    expectTypeOf<Transactions.Transaction>(transaction)
  })

  it("can get unenriched transactions", async function() {
    const {data: transactions} = await moneyhub.getUnenrichedTransactions({
      userId,
    })

    expect(transactions.length).to.be.greaterThan(1)
    expectTypeOf<Transactions.TransactionUnenriched[]>(transactions)
  })

  it("can get unenriched transactions with limit", async function() {
    const {data: transactions} = await moneyhub.getUnenrichedTransactions({
      userId,
      params: {limit: 1},
    })

    transactionId = transactions[0].id

    expect(transactions.length).to.eql(1)
    expectTypeOf<Transactions.TransactionUnenriched[]>(transactions)
  })

  it("can get one unenriched transaction", async function() {
    const {data: transaction} = await moneyhub.getUnenrichedTransaction({
      userId,
      transactionId,
    })

    expect(transaction.id).to.equal(transactionId)
    expectTypeOf<Transactions.TransactionUnenriched>(transaction)
  })

  it.skip("can get one transaction with text query param", async function() {
    const {data: transactions} = await moneyhub.getTransactions({
      userId,
      params: {text: "moneyhub best"},
    })

    expect(transactions).to.have.length(1)
    expect(transactions[0].notes).to.equal("moneyhub is the best")
  })

  it("can update one transaction", async function() {
    const shortDescription = new Date().toISOString()
    const transaction = {
      amount: {
        value: 5400,
      },
      shortDescription,
    }

    const {data} = await moneyhub.updateTransaction({
      userId,
      transactionId,
      transaction,
    })

    expect(data.shortDescription).to.equal(shortDescription)
    expectTypeOf<Transactions.Transaction>(data)
  })

  describe("creating and deleting a manual transaction", function() {
    let accountId: string
    let transactionCrated: Transactions.Transaction
    let status: any

    before(async function() {
      const account: Accounts.AccountPost = {
        "accountName": "Account name",
        "providerName": "Provider name",
        "type": "cash:current",
        "accountType": "personal",
        "balance": {
          "date": "2018-08-12",
          "amount": {
            "value": 300023,
          },
        },
      }

      const {data: {id}} = await moneyhub.createAccount({userId, account})
      accountId = id

      const transaction: Transactions.TransactionPost = {
        accountId,
        "amount": {
          "value": -2300,
        },
        "categoryId": "std:4b0255f0-0309-4509-9e05-4b4e386f9b0d",
        "categoryIdConfirmed": true,
        "longDescription": "New transaction",
        "shortDescription": "transaction",
        "notes": "notes",
        "status": "posted",
        "date": "2018-07-10T12:00:00+00:00",
      }

      const {data} = await moneyhub.addTransaction({userId, transaction})
      transactionCrated = data
      await delay(500)
      status = await moneyhub.deleteTransaction({userId, transactionId: transactionCrated.id})

    })

    after(async function() {
      await moneyhub.deleteAccount({userId, accountId})
    })

    it("creates a transaction", async function() {
      expect(transactionCrated).to.have.property("id")
      expectTypeOf<Transactions.Transaction>(transactionCrated)
    })

    it("deletes transaction", async function() {
      expect(status).to.equal(204)
    })
  })
})
