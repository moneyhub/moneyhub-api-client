const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")
const {Moneyhub} = require("../../src/index")
const config = require("../config")
const {DEFAULT_NONCE, DEFAULT_STATE, DEFAULT_BANK_ID} = require("../constants")

const optionDefinitions = [
  {name: "id", alias: "i", type: String, description: "required"},
  {
    name: "bank-id",
    alias: "b",
    defaultValue: DEFAULT_BANK_ID,
    type: String,
    description: "required",
  },
  {name: "payee-id", alias: "p", type: String, description: "required"},
  {name: "payee-type", type: String},
  {name: "context", alias: "c", type: String},
  {name: "amount", alias: "a", description: "required"},
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

const usage = commandLineUsage(
  {
    header: "Options",
    optionList: optionDefinitions,
  }
)
const options = commandLineArgs(optionDefinitions)

console.log(usage)

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)

    const payment = {
      bankId: options["bank-id"],
      payeeId: options["payee-id"],
      payeeType: options["payee-type"],
      amount: options.amount,
      payeeRef: options["payee-ref"],
      payerRef: options["payer-ref"],
      state: options.state,
      nonce: options.nonce,
      context: options.context,
      readRefundAccount: options["read-refund-account"],
      userId: options["user-id"]
    }

    const result = await moneyhub.makeRecurringPayment({
      recurringPaymentId: options.id,
      payment
    })
    console.log(JSON.stringify(result, null, 2))
  } catch (e) {
    if (e.response && e.response.body) {
      const {message} = JSON.parse(e.response.body)
      console.error(`Error: ${message}`)
    } else console.error(e)
  }
}

start()
