const fs = require("fs")
const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")
const {Moneyhub} = require("../../../src/index")
const config = require("../../config")

const defaultSplits = [
  {amount: -40, userCategoryId: "22", description: "Food"},
  {amount: -20, userCategoryId: "44", description: "Gift"},
]

const optionDefinitions = [
  {name: "accountId", alias: "a", type: String, description: "required"},
  {name: "transactionId", alias: "t", type: String, description: "required"},
  {
    name: "splits",
    alias: "d",
    type: String,
    description: "optional inline JSON array of splits",
  },
  {
    name: "splitsFile",
    alias: "s",
    type: String,
    description: "optional path to JSON file (array of split objects)",
  },
]

const usage = commandLineUsage(
  {
    header: "Options",
    optionList: optionDefinitions,
  },
)

// PUT /caas/v1/accounts/{accountId}/transactions/{transactionId}/splits
// example: npm run ts-node -- examples/caas/transactions/put-transaction-splits.js -a accTestQA123 -t testQA123 -d '[{"amount":4,"userCategoryId":"2d6078a1-06db-4c9c-b559-f36cec9e4fc1","description":"Food"},{"amount":6,"userCategoryId":"22","description":"Gift"}]'

console.log(usage)

const options = commandLineArgs(optionDefinitions)

const loadSplits = () => {
  if (options.splits) {
    return JSON.parse(options.splits)
  }

  if (options.splitsFile) {
    return JSON.parse(fs.readFileSync(options.splitsFile, "utf8"))
  }

  return defaultSplits
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
