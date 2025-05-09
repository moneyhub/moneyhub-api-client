const {Moneyhub} = require("../../src/index")
const config = require("../config")

const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")

const optionDefinitions = [
  {name: "userId", alias: "u", type: String, description: "required"},
  {name: "goalId", alias: "g", type: String, description: "required"},
]

const usage = commandLineUsage(
  {
    header: "Options",
    optionList: optionDefinitions,
  }
)
console.log(usage)

const {goalId, userId} = commandLineArgs(optionDefinitions)

if (!goalId) throw new Error("goalId is required")
if (!userId) throw new Error("userId is required")

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)

    const result = await moneyhub.getSavingsGoal({goalId, userId})
    console.log(JSON.stringify(result, null, 2))
  } catch (e) {
    console.log(e)
    console.error(e.response.body)
  }
}

start()
