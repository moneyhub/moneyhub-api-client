const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")
const {Moneyhub} = require("../../../src/index")
const config = require("../../config")

const optionDefinitions = [
  {name: "accountId", alias: "a", type: String, description: "required"},
  {name: "transactionId", alias: "t", type: String, description: "required"},
]

const usage = commandLineUsage(
  {
    header: "Options",
    optionList: optionDefinitions,
  },
)

// example: node caas/transactions/delete-transaction-splits.js -a accountId -t transactionId

console.log(usage)

const options = commandLineArgs(optionDefinitions)

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)
    const status = await moneyhub.caasDeleteTransactionSplits({
      accountId: options.accountId,
      transactionId: options.transactionId,
    })
    console.log(`Transaction splits removed (HTTP ${status})`)
  } catch (e) {
    console.log(e)
    console.error(e.response && e.response.body)
  }
}

start()
