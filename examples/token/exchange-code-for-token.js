const Moneyhub = require("../../src/index")
const config = require("../config")
const {DEFAULT_STATE, DEFAULT_NONCE} = require("../constants")
const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")

const optionDefinitions = [
  {name: "code", alias: "c", type: String, description: "required"},
  {name: "state", alias: "s", defaultValue: DEFAULT_STATE, type: String},
  {name: "localstate", defaultValue: DEFAULT_STATE, type: String},
  {name: "nonce", alias: "n", defaultValue: DEFAULT_NONCE, type: String},
  {name: "idtoken", alias: "i", type: String},
  {name: "userId", alias: "u", type: String},
]

const usage = commandLineUsage(
  {
    header: "Options",
    optionList: optionDefinitions,
  }
)
console.log(usage)

const options = commandLineArgs(optionDefinitions)
const {
  code, state, userId, nonce, idtoken, localstate,
} = options

if (!code) throw new Error("code needs to be provided")

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)
    const paramsFromCallback = {
      code,
      state,
      id_token: idtoken,
    }
    const localParams = {
      sub: userId,
      nonce,
      state: localstate,
    }
    const result = await moneyhub.exchangeCodeForTokens({paramsFromCallback, localParams})
    console.log(JSON.stringify(result, null, 2))
  } catch (e) {
    console.log(e)
  }
}

start()
