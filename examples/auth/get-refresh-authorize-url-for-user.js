const {Moneyhub} = require("../../src/index")
const config = require("../config")

const {DEFAULT_STATE, DEFAULT_NONCE} = require("../constants")

const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")

const optionDefinitions = [
  {name: "userId", alias: "u", type: String, description: "required"},
  {name: "connectionId", alias: "c", type: String, description: "required"},
  {name: "state", alias: "s", defaultValue: DEFAULT_STATE, type: String},
  {name: "nonce", alias: "n", defaultValue: DEFAULT_NONCE, type: String},
  {name: "claims", alias: "l", type: String},
  {name: "enable-async", alias: "e", type: Boolean},
]

const usage = commandLineUsage(
  {
    header: "Options",
    optionList: optionDefinitions,
  }
)
console.log(usage)

const options = commandLineArgs(optionDefinitions)
const {userId, state, connectionId, nonce, "enable-async": enableAsync} = options
const claims = options.claims && JSON.parse(options.claims)

if (!userId || !connectionId) throw new Error("UserId and connectionId needs to be provided")

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)

    const data = await moneyhub.getRefreshAuthorizeUrlForCreatedUser({
      userId,
      state,
      nonce,
      connectionId,
      claims,
      enableAsync
    })
    console.log(data)

  } catch (e) {
    console.log(e)
    console.error(e.response.body)
  }
}

start()
