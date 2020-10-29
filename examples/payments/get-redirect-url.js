const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")
const Moneyhub = require("../../src/index")
const config = require("../config")
const {DEFAULT_NONCE, DEFAULT_STATE, DEFAULT_BANK_ID} = require("../constants")

const optionDefinitions = [
  {
    name: "bank-id",
    alias: "b",
    defaultValue: DEFAULT_BANK_ID,
    type: String,
    description: "required",
  },
  {name: "payee-id", alias: "p", type: String, description: "required"},
  {name: "payee-type", type: String},
  {name: "payer-id", type: String},
  {name: "payer-type", type: String},
  {name: "payer-name", type: String},
  {name: "payer-email", type: String},
  {name: "amount", alias: "a", defaultValue: 100, description: "required"},
  {
    name: "payee-ref",
    alias: "e",
    defaultValue: "Payee ref",
    type: String,
    description: "required",
  },
  {
    name: "payer-ref",
    alias: "r",
    defaultValue: "Payer ref",
    type: String,
    description: "required",
  },
  {
    name: "state",
    alias: "s",
    defaultValue: DEFAULT_STATE,
    type: String,
    description: "required",
  },
  {name: "nonce", alias: "n", defaultValue: DEFAULT_NONCE, type: String},
]

const usage = commandLineUsage({
  header: "Options",
  optionList: optionDefinitions,
})
const options = commandLineArgs(optionDefinitions)

console.log(usage)
console.log(JSON.stringify(options, null, 2))

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)

    const {data: [payment]} = await moneyhub.getPayments({
      limit: 1,
    })
    const {data: [user]} = await moneyhub.getUsers({limit: 1})

    const {id: authRequestId} = payment
    const {userId} = user

    const errorRedirectUrl = `https://invite-dev.moneyhub.co.uk/oauth/callback?state=ozone__${authRequestId}__${userId}&error=server_error`
    console.log("\nERROR REDIRECT URL")
    console.log(errorRedirectUrl)

  } catch (e) {
    console.log(e)
  }
}

start()
