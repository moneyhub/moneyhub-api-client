const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")
const {Moneyhub} = require("../../src/index")
const config = require("../config")

const optionDefinitions = [
  {name: "accountId", alias: "a", type: String, description: "required - Account ID"},
  {name: "userId", alias: "u", type: String, description: "optional - User ID"},
  {name: "limit", alias: "l", type: Number, description: "optional - Limit number of results"},
]

const usage = commandLineUsage(
  {
    header: "Options",
    optionList: optionDefinitions,
  }
)

// example: node caas/get-transactions.js -a accountId -u userId -l 50

console.log(usage)

const options = commandLineArgs(optionDefinitions)

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)
    const result = await moneyhub.caasGetTransactions({
      accountId: options.accountId,
      userId: options.userId,
      limit: options.limit,
    })
    
    console.log("Transactions:")
    console.log(JSON.stringify(result, null, 2))
  } catch (e) {
    console.log(e)
    console.error(e.response && e.response.body)
  }
}

start()
