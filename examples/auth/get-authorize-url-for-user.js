const {Moneyhub} = require("../../src/index")
const config = require("../config")

const {DEFAULT_BANK_ID, DEFAULT_STATE, DEFAULT_NONCE} = require("../constants")

const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")

const optionDefinitions = [
  {name: "userId", alias: "u", type: String, description: "required"},
  {name: "state", alias: "s", defaultValue: DEFAULT_STATE, type: String},
  {name: "bankId", alias: "b", defaultValue: DEFAULT_BANK_ID, type: String},
  {name: "nonce", alias: "n", defaultValue: DEFAULT_NONCE, type: String},
  {name: "claims", alias: "c", type: String},
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
const {userId, state, bankId, nonce, "enable-async": enableAsync} = options

if (!userId) throw new Error("userId is required")
const claims = options.claims && JSON.parse(options.claims)

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)


    const data = await moneyhub.getAuthorizeUrlForCreatedUser({
      userId,
      state,
      bankId,
      nonce,
      claims,
      enableAsync,
    })
    console.log(data)

  } catch (e) {
    console.log(e)
    console.error(e.response.body)
  }
}

start()
