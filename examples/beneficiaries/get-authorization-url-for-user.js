const Moneyhub = require("../../src/index")
const config = require("../config")
const R = require("ramda")
const {DEFAULT_BANK_ID, DEFAULT_STATE, DEFAULT_NONCE} = require("../constants")

const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")

const optionDefinitions = [
  {name: "userId", alias: "u", type: String, description: "required"},
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
const {userId, state, bankId, nonce} = options

if (!userId) throw new Error("userId is required")
const beneficiaryClaim = {
  "id_token": {
    "mh:consent": {
      "essential": true,
      "value": {
        "permissions": ["ReadBeneficiariesDetail"]
      }
    }
  }
}
const claims = (options.claims && JSON.parse(options.claims)) || {}

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)


    const data = await moneyhub.getAuthorizeUrlForCreatedUser({
      userId,
      state,
      bankId,
      nonce,
      claims: R.mergeDeepRight(beneficiaryClaim, claims),
    })
    console.log(data)

  } catch (e) {
    console.log(e)
  }
}

start()
