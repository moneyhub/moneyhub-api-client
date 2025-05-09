const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")
const {Moneyhub} = require("../../src/index")
const config = require("../config")

const optionDefinitions = [
  {name: "userId", alias: "u", type: String, description: "required"},
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

const transactionData = {
  "accountId": "c390a94f-2309-4cdf-8d02-b0c5304d9f66",
  "amount": {
    "value": -2300
  },
  "categoryId": "std:4b0255f0-0309-4509-9e05-4b4e386f9b0d",
  "categoryIdConfirmed": true,
  "longDescription": "New transaction",
  "shortDescription": "transaction",
  "notes": "notes",
  "status": "posted",
  "date": "2018-07-10T12:00:00+00:00"
}


const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)

    const {data: account} = await moneyhub.createAccount({userId: options.userId, account: accountData})
    transactionData.accountId = account.id
    // random account id
    // transactionData.accountId = "6014a43f-a353-49a8-92e1-607f5ced8192"

    const {data: transaction} = await moneyhub.addTransaction({userId: options.userId, transaction: transactionData})
    console.log(JSON.stringify(transaction, null, 2))

  } catch (e) {
    console.log(e)
    console.error(e.response.body)
  }
}

start()
