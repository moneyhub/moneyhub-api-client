const {Moneyhub} = require("../../src/index")
const config = require("../config")
const {DEFAULT_BANK_ID} = require("../constants")

const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")

const optionDefinitions = [
  {name: "userId", alias: "u", type: String, description: "required"},
  {name: "bankId", alias: "b", defaultValue: DEFAULT_BANK_ID, type: String},
  {name: "permissions", alias: "p", description: "comma separated extra permissions", type: String},
  {name: "ip", alias: "i", description: "ip-address", type: String},
  {name: "customerLastLoggedTime", alias: "t", type: String},
]

const usage = commandLineUsage({
  header: "Options",
  optionList: optionDefinitions,
})
console.log(usage)

const options = commandLineArgs(optionDefinitions)

const {userId, bankId, permissions, ip, customerLastLoggedTime} = options

if (!userId) throw new Error("userId is required")

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)
    const data = await moneyhub.createAuthRequest({
      scope: `openid id:${bankId}`,
      redirectUri: config.client.redirect_uri,
      userId,
      permissions: permissions && permissions.split(","),
      customerIpAddress: ip,
      customerLastLoggedTime
    })
    console.log(data)
  } catch (e) {
    console.log(e)
  }
}

start()
