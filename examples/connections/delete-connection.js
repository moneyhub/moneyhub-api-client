const Moneyhub = require("../../src/index")
const config = require("../config")

const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")

const optionDefinitions = [
  {name: "userId", alias: "u", type: String, description: "required"},
  {name: "connectionId", alias: "c", type: String, description: "required"},
]

const usage = commandLineUsage(
  {
    header: "Options",
    optionList: optionDefinitions,
  }
)
console.log(usage)

const {userId, connectionId} = commandLineArgs(optionDefinitions)

if (!userId || !connectionId) throw new Error("userId  and connectionId are required")

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)

    const response = await moneyhub.deleteUserConnection({userId, connectionId})
    console.log(JSON.stringify({statusCode: response.statusCode}, null, 2))

  } catch (e) {
    console.log(e)
  }
}

start()
