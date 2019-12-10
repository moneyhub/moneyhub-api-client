const Moneyhub = require("../../src/index")
const config = require("../config")

const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")

const optionDefinitions = [
  {name: "accessToken", alias: "a", type: String, description: "required"},
  {name: "connectionId", alias: "c", type: String, description: "required"},
  {name: "customerIpAddress", alias: "i", type: String},
  {name: "customerLastLoggedTime", alias: "t", type: String},
]

const usage = commandLineUsage({
  header: "Options",
  optionList: optionDefinitions,
})
console.log(usage)

const {
  accessToken,
  connectionId,
  customerIpAddress,
  customerLastLoggedTime,
} = commandLineArgs(optionDefinitions)

if (!accessToken || !connectionId) throw new Error("accessToken and connectionId is required")

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)

    const result = await moneyhub.syncUserConnectionWithToken({
      accessToken,
      connectionId,
      customerIpAddress,
      customerLastLoggedTime,
    })
    console.log(JSON.stringify(result, null, 2))
  } catch (e) {
    console.log(e)
  }
}

start()
