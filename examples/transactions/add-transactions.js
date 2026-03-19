const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")
const {Moneyhub} = require("../../src/index")
const config = require("../config")
const {omit} = require("ramda")

const optionDefinitions = [
  {name: "userId", alias: "u", type: String, description: "required"},
  {name: "accountId", alias: "a", type: String, description: "required"},
  {name: "categorise", alias: "c", type: Boolean},
]

const usage = commandLineUsage(
  {
    header: "Options",
    optionList: optionDefinitions,
  }
)

// example node transactions/add-transactions.js -a 86464b27-85b9-4ca7-b758-79f8c270ae52 -u 60e3141b93a4d5bee7c284a2 -c

console.log(usage)

const options = commandLineArgs(optionDefinitions)

const transactions = [
  {
    "accountId": options.accountId,
    "amount": {
      "value": -4500
    },
    "categoryId": "std:4b0255f0-0309-4509-9e05-4b4e386f9b0d",
    "categoryIdConfirmed": true,
    "longDescription": "Tesco",
    "shortDescription": "description 1",
    "notes": "notes",
    "status": "posted",
    "date": "2021-07-10T12:00:00+00:00"
  },
  {
    "accountId": options.accountId,
    "amount": {
      "value": 7800
    },
    "categoryId": "std:4b0255f0-0309-4509-9e05-4b4e386f9b0d",
    "longDescription": "ASDA",
    "notes": "notes",
    "status": "pending",
    "date": "2021-07-10T12:00:00+00:00"
  }
]

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)

    const result = await moneyhub.addTransactions({
      userId: options.userId,
      transactions,
      params: omit(["userId"], options)
    })
    console.log(JSON.stringify(result, null, 2))
  } catch (e) {
    console.log(e)
    console.error(e.response.body)
  }
}

start()
