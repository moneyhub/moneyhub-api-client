const {Moneyhub} = require("../../src/index")
const config = require("../config")

const DEFAULT_CLIENT_USER_ID = "some-client-user-id"

const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")

const optionDefinitions = [
  {name: "clientUserId", alias: "u", defaultValue: DEFAULT_CLIENT_USER_ID, type: String, description: "required"},
]

const usage = commandLineUsage(
  {
    header: "Options",
    optionList: optionDefinitions,
  }
)
console.log(usage)

const {clientUserId} = commandLineArgs(optionDefinitions)

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)

    const user = await moneyhub.registerUser({clientUserId})
    console.log(JSON.stringify(user, null, 2))

  } catch (e) {
    console.log(e)
  }
}

start()
