const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")
const {Moneyhub} = require("../../src/index")
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
  {name: "context", alias: "c", type: String},
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
  {
    name: "read-refund-account",
    type: Boolean,
  },
  {
    name: "user-id",
    alias: "u",
    type: String
  }
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

    const url = await moneyhub.getPaymentAuthorizeUrl({
      bankId: options["bank-id"],
      payeeId: options["payee-id"],
      payeeType: options["payee-type"],
      amount: options.amount,
      payeeRef: options["payee-ref"],
      payerRef: options["payer-ref"],
      state: options.state,
      nonce: options.nonce,
      payerType: options["payer-type"],
      payerId: options["payer-id"],
      payerName: options["payer-name"],
      payerEmail: options["payer-email"],
      context: options.context,
      readRefundAccount: options["read-refund-account"],
      userId: options["user-id"]
    })

    console.log(url)

  } catch (e) {
    console.log(e)
  }
}

start()
