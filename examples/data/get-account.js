const commandLineArgs = require("command-line-args")
const Moneyhub = require("../../src/index")
const config = require("../config")

const optionDefinitions = [
  {name: "accountId", alias: "a", type: String},
  {name: "userId", alias: "u", type: String},
]

const options = commandLineArgs(optionDefinitions)

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)

    const result = await moneyhub.getAccount(options.userId, options.accountId)
    console.log(JSON.stringify(result, null, 2))
  } catch (e) {
    console.log(e)
  }
}

start()
