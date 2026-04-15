const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")
const {Moneyhub} = require("../../src/index")
const config = require("../config")

const optionDefinitions = [
  {name: "accountId", alias: "a", type: String, description: "required - Account ID"},
  {name: "transactionId", alias: "t", type: String, description: "required - Transaction ID"},
  {
    name: "includeFieldTiers",
    alias: "i",
    type: String,
    description: "optional - basic | search_pro | search_enterprise | search_enterprise_plus (default: basic)",
  },
]

const usage = commandLineUsage(
  {
    header: "Options",
    optionList: optionDefinitions,
  }
)

// example: node caas/get-enhanced-transaction.js -a accountId -t transactionId -i search_pro

console.log(usage)

const options = commandLineArgs(optionDefinitions)

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)
    const result = await moneyhub.caasGetEnhancedTransaction({
      accountId: options.accountId,
      transactionId: options.transactionId,
      includeFieldTiers: options.includeFieldTiers,
    })
    console.log(JSON.stringify(result, null, 2))
  } catch (e) {
    console.log(e)
    console.error(e.response && e.response.body)
  }
}

start()
