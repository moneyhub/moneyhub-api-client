const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")
const Moneyhub = require("../../src/index")
const config = require("../config")

const optionDefinitions = [
  {name: "userId", alias: "u", type: String, description: "required"},
  {name: "name", alias: "n", type: String, description: "required"},
  {name: "type", alias: "t", type: String, description: "required"},
  {name: "accountIds", alias: "a", type: String, description: "optional"},
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

    const result = await moneyhub.addProject(options.userId, {
      name: options.name,
      accountIds: options.accountIds && options.accountIds.split(","),
      type: options.type,
    })

    console.log(result)

  } catch (e) {
    console.log(e)
    console.log(e.response.body)
  }
}

start()
