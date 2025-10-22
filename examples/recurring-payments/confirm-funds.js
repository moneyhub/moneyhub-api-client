const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")
const {Moneyhub} = require("../../src/index")
const config = require("../config")

const optionDefinitions = [
  {name: "id", alias: "i", type: String, description: "Recurring payment ID (required)"},
  {name: "amount", alias: "a", type: String, defaultValue: "10.00", description: "Amount to check (required)"},
  {name: "currency", alias: "c", type: String, defaultValue: "GBP", description: "Currency code (required)"},
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
    if (!options.id) {
      console.error("Error: Recurring payment ID is required (use --id or -i)")
      return
    }

    const moneyhub = await Moneyhub(config)

    const fundsConfirmation = {
      amount: options.amount,
      currency: options.currency,
    }

    const result = await moneyhub.confirmFundsForRecurringPayment({
      recurringPaymentId: options.id,
      fundsConfirmation,
    })
    console.log(JSON.stringify(result, null, 2))
  } catch (e) {
    console.error(e)
    console.error(e.response.body)
  }
}

start()

