const fs = require("fs")
const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")
const {Moneyhub} = require("../../src/index")
const config = require("../config")

const defaultSplits = [
  {amount: -40, userCategoryId: "22", description: "Food"},
  {amount: -20, userCategoryId: "44", description: "Gift"},
]

const optionDefinitions = [
  {name: "accountId", alias: "a", type: String, description: "required"},
  {name: "transactionId", alias: "t", type: String, description: "required"},
  {
    name: "splitsFile",
    alias: "s",
    type: String,
    description: "optional path to JSON file: array of { amount, userCategoryId, description }",
  },
]

const usage = commandLineUsage(
  {
    header: "Options",
    optionList: optionDefinitions,
  },
)

// example: node caas/put-transaction-splits.js -a accountId -t transactionId
// example: node caas/put-transaction-splits.js -a accountId -t transactionId -s ./splits.json

console.log(usage)

const options = commandLineArgs(optionDefinitions)

const loadSplits = () => {
  if (!options.splitsFile) {
    return defaultSplits
  }

  return JSON.parse(fs.readFileSync(options.splitsFile, "utf8"))
}

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)
    const splits = loadSplits()
    const result = await moneyhub.caasPutTransactionSplits({
      accountId: options.accountId,
      transactionId: options.transactionId,
      splits,
    })
    console.log(JSON.stringify(result, null, 2))
  } catch (e) {
    console.log(e)
    console.error(e.response && e.response.body)
  }
}

start()
