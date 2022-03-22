const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")
const Moneyhub = require("../../src/index")
const config = require("../config")

const optionDefinitions = [
  {name: "id", alias: "i", type: String, description: "required"},
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

    const result = await moneyhub.revokeRecurringPayment({
      recurringPaymentId: options.id,
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
