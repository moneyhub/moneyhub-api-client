const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")
const Moneyhub = require("../../src/index")
const config = require("../config")
const {BANK_IDS} = require("../constants")

const optionDefinitions = [
  {name: "bank-id", alias: "b", defaultValue: BANK_IDS.MODELO_OPEN_BANKING_TEST, type: String, description: "required"},
  {name: "payee-id", alias: "p", type: String, description: "required"},
  {name: "amount", alias: "a", defaultValue: 100, description: "required"},
  {name: "payee-ref", alias: "e", defaultValue: "Payee ref", type: String, description: "required"},
  {name: "payer-ref", alias: "r", defaultValue: "Payer ref", type: String, description: "required"},
  {name: "state", alias: "s", defaultValue: "foobar", type: String, description: "required"},
  {name: "nonce", alias: "n", type: String},
]

const usage = commandLineUsage(
  {
    header: "Options",
    optionList: optionDefinitions,
  }
)
const options = commandLineArgs(optionDefinitions)

console.log(usage)
console.log(JSON.stringify(options, null, 2))

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)

    const url = await moneyhub.getPaymentAuthorizeUrl({
      bankId: options["bank-id"],
      payeeId: options["payee-id"],
      amount: options.amount,
      payeeRef: options["payee-ref"],
      payerRef: options["payer-ref"],
      state: options.state,
      nonce: options.nonce,
    })

    console.log(url)

  } catch (e) {
    console.log(e)
  }
}

start()
