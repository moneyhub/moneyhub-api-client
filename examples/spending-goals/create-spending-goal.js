const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")
const {Moneyhub} = require("../../src/index")
const config = require("../config")

const optionDefinitions = [
  {name: "userId", alias: "u", type: String, description: "required"},
  {name: "categoryId", alias: "c", type: String, description: "required"},
  {name: "value", alias: "v", type: Number, description: "required"},
  {name: "periodStart", alias: "s", type: String},
  {name: "periodType", alias: "t", type: String}
]

const usage = commandLineUsage(
  {
    header: "Options",
    optionList: optionDefinitions,
  }
)
console.log(usage)

const {categoryId, value, periodStart, periodType, userId} = commandLineArgs(optionDefinitions)

if (!userId) throw new Error("userId is required")
if (!categoryId) throw new Error("categoryId is required")
if (!value) throw new Error("value is required")


const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)

    const result = await moneyhub.createSpendingGoal({
      categoryId,
      amount: {value},
      periodStart,
      periodType,
      userId,
    })
    console.log(JSON.stringify(result, null, 2))
  } catch (e) {
    console.log(e)
  }
}

start()
