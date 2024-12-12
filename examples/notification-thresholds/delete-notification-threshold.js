const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")
const {Moneyhub} = require("../../src/index")
const config = require("../config")

const optionDefinitions = [
  {name: "userId", alias: "u", type: String, description: "required"},
  {name: "accountId", alias: "a", type: String, description: "required"},
  {name: "thresholdId", alias: "i", type: String, description: "required"},
]

const usage = commandLineUsage(
  {
    header: "Options",
    optionList: optionDefinitions,
  }
)
console.log(usage)
const {userId, accountId, thresholdId} = commandLineArgs(optionDefinitions)

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)

    const result = await moneyhub.deleteNotificationThreshold({
      userId,
      accountId,
      thresholdId,
    })

    console.log(result)

  } catch (e) {
    console.log(e)
    console.log(e.response.body)
  }
}

start()
