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
  {name: "payee-id", alias: "p", type: String},
  {name: "payee-type", type: String},
  {name: "payer-id", type: String},
  {name: "payer-type", type: String},
  {
    name: "reference",
    alias: "r",
    defaultValue: "Recurring payment",
    type: String,
    description: "required",
  },
  {name: "valid-from-date", type: String},
  {name: "valid-to-date", type: String},
  {name: "maximum-daily-amount", type: Number},
  {name: "maximum-monthly-amount", type: Number},
  {name: "maximum-amount", type: Number},
  {name: "currency", defaultValue: "GBP", type: String},
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

    const periodicLimits = []

    if (options["maximum-daily-amount"]) {
      periodicLimits.push({
        amount: options["maximum-daily-amount"],
        currency: options.currency,
        periodType: "Day",
        periodAlignment: "Consent",
      })
    }

    if (options["maximum-monthly-amount"]) {
      periodicLimits.push({
        amount: options["maximum-monthly-amount"],
        currency: options.currency,
        periodType: "Month",
        periodAlignment: "Consent",
      })
    }

    const url = await moneyhub.getRecurringPaymentAuthorizeUrl({
      bankId: options["bank-id"],
      payeeId: options["payee-id"],
      payeeType: options["payee-type"],
      payerId: options["payer-id"],
      payerType: options["payer-type"],
      reference: options.reference,
      validFromDate: options["valid-from-date"],
      validToDate: options["valid-to-date"],
      maximumIndividualAmount: options["maximum-amount"],
      currency: options.currency,
      periodicLimits,
      context: options.context,
      state: options.state,
      nonce: options.nonce,
    })

    console.log(url)
  } catch (e) {
    console.error(e)
  }
}

start()
