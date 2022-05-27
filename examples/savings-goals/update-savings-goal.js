const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")
const {Moneyhub} = require("../../src/index")
const config = require("../config")

const optionDefinitions = [
  {name: "userId", alias: "u", type: String, description: "required"},
  {name: "name", alias: "n", type: String},
  {name: "value", alias: "v", type: Number},
  {name: "imageUrl", alias: "s", type: String},
  {name: "notes", alias: "t", type: String},
  {name: "accounts", alias: "a", type: Array},
  {name: "goalId", alias: "g", type: String, description: "required"}
]

const usage = commandLineUsage(
  {
    header: "Options",
    optionList: optionDefinitions,
  }
)
console.log(usage)

const {name, value, imageUrl, notes, userId, accounts, goalId} = commandLineArgs(optionDefinitions)

if (!userId) throw new Error("userId is required")
if (!goalId) throw new Error("goalId is required")


const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)

    const result = await moneyhub.updateSavingsGoal({
      name,
      amount: {value},
      imageUrl,
      notes,
      userId,
      accounts: accounts.map(id => ({id})),
      goalId
    })
    console.log(JSON.stringify(result, null, 2))
  } catch (e) {
    console.log(e)
  }
}

start()
