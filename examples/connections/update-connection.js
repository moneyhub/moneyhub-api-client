const Moneyhub = require("../../src/index")
const config = require("../config")

const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")

const optionDefinitions = [
  {name: "userId", alias: "u", type: String, description: "required"},
  {name: "connectionId", alias: "c", type: String, description: "required"},
  {name: "expiresAt", alias: "e", type: String, description: "required"},
]

const usage = commandLineUsage(
  {
    header: "Options",
    optionList: optionDefinitions,
  }
)
console.log(usage)

const {userId, connectionId, expiresAt} = commandLineArgs(optionDefinitions)

if (!userId) throw new Error("userId is required")

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)

    const result = await moneyhub.updateUserConnection({userId, connectionId, expiresAt})
    console.log(JSON.stringify(result, null, 2))

  } catch (e) {
    console.log(e)
  }
}

start()
