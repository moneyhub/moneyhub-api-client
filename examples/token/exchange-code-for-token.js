const Moneyhub = require("../../src/index")
const config = require("../config")
const {DEFAULT_STATE, DEFAULT_NONCE} = require("../constants")
const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")

const optionDefinitions = [
  {name: "code", alias: "c", type: String, description: "required"},
  {name: "state", alias: "s", defaultValue: DEFAULT_STATE, type: String},
  {name: "nonce", alias: "n", defaultValue: DEFAULT_NONCE, type: String},
  {name: "id-token", alias: "i", type: String},
]

const usage = commandLineUsage(
  {
    header: "Options",
    optionList: optionDefinitions,
  }
)
console.log(usage)

const options = commandLineArgs(optionDefinitions)

if (!options.code) throw new Error("code needs to be provided")

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)

    const result = await moneyhub.exchangeCodeForTokens({
      state: options.state,
      code: options.code,
      nonce: options.nonce,
      id_token: options["id-token"],
    })
    console.log(JSON.stringify(result, null, 2))
  } catch (e) {
    console.log(e)
  }
}

start()
