const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")
const {Moneyhub} = require("../../src/index")
const config = require("../config")

const optionDefinitions = [
  {name: "accountId", alias: "a", type: String, description: "required"},
  {name: "transactionId", alias: "t", type: String, description: "required"},
  {name: "l2CategoryId", alias: "c", type: String, description: "required"},
]

const usage = commandLineUsage(
  {
    header: "Options",
    optionList: optionDefinitions,
  }
)

// example node caas/patch-transaction.js -a accountId -t transactionId -l 21

console.log(usage)

const options = commandLineArgs(optionDefinitions)

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)
    const result = await moneyhub.caasPatchTransaction({
      accountId: options.accountId,
      transactionId: options.transactionId,
      l2CategoryId: options.l2CategoryId,
    })
    console.log(JSON.stringify(result, null, 2))
  } catch (e) {
    console.log(e)
    console.error(e.response && e.response.body)
  }
}

start()
