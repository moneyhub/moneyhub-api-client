const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")
const Moneyhub = require("../../src/index")
const config = require("../config")

const optionDefinitions = [
  {name: "userId", alias: "u", type: String, description: "required"},
  {name: "goalId", alias: "g", type: String, description: "required"},
  {name: "value", alias: "v", type: Number},
  {name: "categoryId", alias: "c", type: String}
]

const usage = commandLineUsage(
  {
    header: "Options",
    optionList: optionDefinitions,
  }
)
console.log(usage)

const {categoryId, value, goalId, userId} = commandLineArgs(optionDefinitions)

if (!userId) throw new Error("userId is required")
if (!goalId) throw new Error("goalId is required")

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)

    const result = await moneyhub.updateSpendingGoal({
      categoryId,
      amount: {value},
      goalId,
      userId,
    })
    console.log(JSON.stringify(result, null, 2))
  } catch (e) {
    console.log(e)
  }
}

start()
