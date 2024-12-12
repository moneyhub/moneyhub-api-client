const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")
const {Moneyhub} = require("../../src/index")
const config = require("../config")

const optionDefinitions = [
  {name: "userId", alias: "u", type: String, description: "required"},
  {name: "accountId", alias: "a", type: String, description: "required"},
  {name: "value", alias: "v", type: String, description: "required"},
  {name: "type", alias: "t", type: String, description: "required"},
]

const usage = commandLineUsage(
  {
    header: "Options",
    optionList: optionDefinitions,
  }
)
console.log(usage)
const {userId, accountId, value, type} = commandLineArgs(optionDefinitions)

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)

    const result = await moneyhub.addNotificationThreshold({
      userId,
      accountId,
      threshold: {type, value: parseInt(value, 10)},
    })

    console.log(result)

  } catch (e) {
    console.log(e)
    console.log(e.response.body)
  }
}

start()
