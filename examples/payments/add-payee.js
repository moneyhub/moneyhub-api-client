const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")
const Moneyhub = require("../../src/index")
const config = require("../config")

const optionDefinitions = [
  {name: "account-number", alias: "a", type: String, description: "required"},
  {name: "sort-code", alias: "s", type: String, description: "required"},
  {name: "name", alias: "n", type: String, description: "required"},
  {name: "external-id", alias: "i", type: String},
]

const usage = commandLineUsage(
  {
    header: "Options",
    optionList: optionDefinitions,
  }
)
console.log(usage)

const options = commandLineArgs(optionDefinitions)

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)

    const result = await moneyhub.addPayee({
      accountNumber: options["account-number"],
      sortCode: options["sort-code"],
      name: options.name,
      externalId: options["external-id"],
    })

    console.log(result)

  } catch (e) {
    console.log(e)
    console.log(e.response.body)
  }
}

start()
