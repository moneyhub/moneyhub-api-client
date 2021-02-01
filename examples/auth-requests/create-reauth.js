const Moneyhub = require("../../src/index")
const config = require("../config")

const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")

const optionDefinitions = [
  {name: "userId", alias: "u", type: String, description: "required"},
  {name: "connectionId", alias: "c", type: String, description: "required"},
]

const usage = commandLineUsage({
  header: "Options",
  optionList: optionDefinitions,
})
console.log(usage)

const options = commandLineArgs(optionDefinitions)

const {userId, connectionId} = options

if (!userId) throw new Error("userId is required")
if (!connectionId) throw new Error("connectionId is required")

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)
    const data = await moneyhub.createAuthRequest({
      scope: "openid reauth",
      redirectUri: config.client.redirect_uri,
      connectionId,
      userId,
    })
    console.log(data)
  } catch (e) {
    console.log(e)
    console.log(e.response.body)
  }
}

start()
