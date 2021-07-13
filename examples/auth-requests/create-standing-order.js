const Moneyhub = require("../../src/index")
const config = require("../config")
const {DEFAULT_NONCE, DEFAULT_STATE, DEFAULT_BANK_ID} = require("../constants")

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
  {
    name: "reference",
    alias: "r",
    defaultValue: "Standing Order",
    type: String,
    description: "required",
  },
  {
    name: "frequency-repeat",
    alias: "f",
    defaultValue: "Daily",
    type: String,
    description: "required",
  },
  {name: "frequency-day", alias: "y", type: Number},
  {name: "frequency-week", alias: "w", type: Number},
  {name: "number-of-payments", alias: "o", type: Number},
  {name: "first-amount", alias: "a", defaultValue: 100, type: Number, description: "required"},
  {name: "recurring-amount", type: Number},
  {name: "final-amount", type: Number},
  {name: "currency", defaultValue: "GBP", type: String},
  {name: "first-date", alias: "d", type: String, description: "required"},
  {name: "recurring-date", type: String},
  {name: "final-date", type: String},
  {name: "context", alias: "c", type: String},
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
    const data = await moneyhub.createAuthRequest({
      scope: `openid standing_orders:create id:${options["bank-id"]}`,
      standingOrder: {
        payeeId: options["payee-id"],
        payeeType: options["payee-type"],
        payerId: options["payer-id"],
        payerType: options["payer-type"],
        reference: options.reference,
        frequency: {
          repeat: options["frequency-repeat"],
          day: options["frequency-day"],
          week: options["frequency-week"],
        },
        numberOfPayments: options["number-of-payments"],
        firstPaymentAmount: options["first-amount"],
        recurringPaymentAmount: options["recurring-amount"],
        finalPaymentAmount: options["final-amount"],
        currency: options.currency,
        firstPaymentDate: options["first-date"],
        recurringPaymentDate: options["recurring-date"],
        finalPaymentDate: options["final-date"],
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
