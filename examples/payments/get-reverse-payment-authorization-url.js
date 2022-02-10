const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")
const Moneyhub = require("../../src/index")
const config = require("../config")
const {DEFAULT_NONCE, DEFAULT_STATE} = require("../constants")

const optionDefinitions = [
  {
    name: "bank-id",
    alias: "b",
    defaultValue: "api",
    type: String,
    description: "required",
  },
  {name: "payment-id", alias: "p", type: String, description: "required"},
  {
    name: "state",
    alias: "s",
    defaultValue: DEFAULT_STATE,
    type: String,
    description: "required",
  },
  {name: "nonce", alias: "n", defaultValue: DEFAULT_NONCE, type: String},
  {name: "amount", alias: "a", type: Number},
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

    const url = await moneyhub.getReversePaymentAuthorizeUrl({
      bankId: options["bank-id"],
      paymentId: options["payment-id"],
      state: options.state,
      nonce: options.nonce,
      amount: options.amount,
    })

    console.log(url)

  } catch (e) {
    console.log(e)
  }
}

start()
