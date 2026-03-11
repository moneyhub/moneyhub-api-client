/* eslint-disable max-statements */
const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")
const {Moneyhub} = require("../../src/index")
const config = require("../config")
const {pluck} = require("ramda")
const optionDefinitions = [
  {name: "userId", alias: "u", type: String},
  {name: "accountId", alias: "a", type: String},
]

const usage = commandLineUsage(
  {
    header: "Options",
    optionList: optionDefinitions,
  }
)
console.log(usage)

const options = commandLineArgs(optionDefinitions)

const accountData = {
  "accountName": "Account name",
  "providerName": "Provider name",
  "type": "cash:current",
  "accountType": "personal",
  "balance": {
    "date": "2018-08-12",
    "amount": {
      "value": 300023
    }
  },
  "details": {
    "AER": 1.3,
    "APR": 13.1,
    "creditLimit": 150000,
    "endDate": "2020-01-01",
    "fixedDate": "2019-01-01",
    "interestFreePeriod": 12,
    "interestType": "fixed",
    "linkedProperty": "ac9bd177-d01e-449c-9f29-d3656d2edc2e",
    "monthlyRepayment": 60000,
    "overdraftLimit": 150000,
    "postcode": "bs1 1aa",
    "runningCost": 20000,
    "runningCostPeriod": "month",
    "term": 13,
    "yearlyAppreciation": -10
  }
}

const transactions = [
  {

    "amount": {
      "value": -4500
    },
    "categoryId": "std:39577c49-350f-45a4-8ec3-48ce205585fb",
    "categoryIdConfirmed": true,
    "longDescription": "Tesco",
    "shortDescription": "Tesco",
    "notes": "notes",
    "status": "posted",
    "date": "2021-07-10T12:00:00+00:00"
  },
  {

    "amount": {
      "value": 7800
    },
    "categoryId": "std:39577c49-350f-45a4-8ec3-48ce205585fb",
    "longDescription": "Amazon",
    "shortDescription": "Amazon",
    "notes": "notes",
    "status": "pending",
    "date": "2021-07-10T12:00:00+00:00"
  }
]

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)

    let userId = options.userId
    let accountId = options.accountId

    if (!userId) {
      const user = await moneyhub.registerUser({})
      userId = user.userId
      console.log("USER CREATED -> ", user)
    }

    if (!accountId) {
      const {data: account} = await moneyhub.createAccount({userId, account: accountData})
      accountId = account.id
      console.log("ACCOUNT CREATED -> ", account)
    }

    transactions.forEach((transaction) => {
      transaction.accountId = accountId
    })

    const {data} = await moneyhub.addTransactions({
      userId,
      transactions,
      params: {categorise: true}
    })


    const {data: trxs} = await moneyhub.getTransactions({
      userId,
      accountId,
      params: {
        ids: pluck("id", data)
      }
    })
    console.log("TRANSACTIONS -> ", JSON.stringify(trxs, null, 2))

  } catch (e) {
    console.log(e)
    console.error(e.response.body)
  }
}

start()
