const Moneyhub = require("../../src/index")
const config = require("../config")
const {DEFAULT_BANK_ID} = require("../constants")

const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")

const optionDefinitions = [
  {
    name: "bank-id",
    alias: "b",
    defaultValue: DEFAULT_BANK_ID,
    type: String,
    description: "required",
  },
  {name: "payment-id", alias: "p", type: String, description: "required"},
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
    const data = await moneyhub.createAuthRequest({
      scope: `openid reverse_payment id:${options["bank-id"]}`,
      reversePayment: {
        paymentId: options["payment-id"],
      },
      redirectUri: config.client.redirect_uri,
    })
    console.log(data)
  } catch (e) {
    console.log(e)
    console.log(e.response.body)
  }
}

start()
