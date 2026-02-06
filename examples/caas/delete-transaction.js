const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")
const {Moneyhub} = require("../../src/index")
const config = require("../config")

const optionDefinitions = [
  {name: "accountId", alias: "a", type: String, description: "required - Account ID"},
  {name: "transactionId", alias: "t", type: String, description: "required - Transaction ID to delete"},
]

const usage = commandLineUsage(
  {
    header: "Options",
    optionList: optionDefinitions,
  }
)

// example: node caas/delete-transaction.js -a accountId -t transactionId

console.log(usage)

const options = commandLineArgs(optionDefinitions)

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)
    await moneyhub.caasDeleteTransaction({
      accountId: options.accountId,
      transactionId: options.transactionId,
    })
    console.log(`Transaction ${options.transactionId} deleted successfully`)
  } catch (e) {
    console.log(e)
    console.error(e.response && e.response.body)
  }
}

start()
