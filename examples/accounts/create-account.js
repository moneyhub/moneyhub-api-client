const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")
const {Moneyhub} = require("../../src/index")
const config = require("../config")

const optionDefinitions = [
  {name: "userId", alias: "u", type: String, description: "required"},
  {name: "accountData", alias: "a", type: String, description: "required"},
]

const usage = commandLineUsage(
  {
    header: "Options",
    optionList: optionDefinitions,
  }
)
console.log(usage)

const options = commandLineArgs(optionDefinitions)

// Parse accountData, and if nothing is provided, use a default account object with all required fields
let accountDataObj
if (!options.accountData) {
  // No accountData provided, use default
  accountDataObj = {
    accountName: "Test Account",
    providerName: "Test Provider",
    type: "cash:current",
    balance: {amount: {value: 20000}, date: "2025-01-01"}
  }
} else {
  try {
    accountDataObj = JSON.parse(options.accountData)
  } catch (e) {
    console.error("Invalid JSON for accountData")
    process.exit(1)
  }
}

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)

    const result = await moneyhub.createAccount({userId: options.userId, account: accountDataObj})
    console.log(JSON.stringify(result, null, 2))

  } catch (e) {
    console.log(e)
    console.error(e.response.body)
  }
}

start()
