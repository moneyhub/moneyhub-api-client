const {Moneyhub} = require("../../src/index")
const config = require("../config")

const {DEFAULT_BANK_ID, DEFAULT_STATE, DEFAULT_NONCE} = require("../constants")

const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")

const optionDefinitions = [
  {name: "userId", alias: "u", type: String},
  {name: "state", alias: "s", defaultValue: DEFAULT_STATE, type: String},
  {name: "bankId", alias: "b", defaultValue: DEFAULT_BANK_ID, type: String},
  {name: "nonce", alias: "n", defaultValue: DEFAULT_NONCE, type: String},
  {name: "claims", alias: "c", type: String},
]

const usage = commandLineUsage(
  {
    header: "Options",
    optionList: optionDefinitions,
  }
)
console.log(usage)

const options = commandLineArgs(optionDefinitions)
const {state, bankId, nonce} = options
let userId = options.userId

const claims = options.claims && JSON.parse(options.claims)

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)

    if (!userId) {
      const user = await moneyhub.registerUser({})
      userId = user.userId
      console.log(user)
    }

    const data = await moneyhub.getAuthorizeUrlForCreatedUser({
      userId,
      state,
      bankId,
      nonce,
      claims,
    })
    console.log(data)

  } catch (e) {
    console.log(e)
    console.error(e.response.body)
  }
}

start()
