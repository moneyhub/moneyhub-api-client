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
  {name: "payee-id", alias: "p", type: String, description: "required"},
  {name: "payee-type", type: String},
  {name: "payer-id", type: String},
  {name: "payer-type", type: String},
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
      scope: `openid payment id:${options["bank-id"]}`,
      payment: {
        payeeId: options["payee-id"],
        amount: options.amount,
        payeeRef: options["payee-ref"],
        payerRef: options["payer-ref"],
      },
      redirectUri: config.client.redirect_uri,
    })
    console.log(data)
  } catch (e) {
    console.log(e)
  }
}

start()
