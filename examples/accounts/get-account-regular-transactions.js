const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")
const Moneyhub = require("../../src/index")
const config = require("../config")

const optionDefinitions = [
  {name: "accountId", alias: "a", type: String, description: "required"},
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

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)

    const result = await moneyhub.getRegularTransactions({
      userId: options.userId,
      accountId: options.accountId
    })
    console.log(JSON.stringify(result, null, 2))
  } catch (e) {
    console.log(e)
  }
}

start()
