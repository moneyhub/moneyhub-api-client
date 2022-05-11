const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")
const Moneyhub = require("../../src/index")
const config = require("../config")

const optionDefinitions = [
  {name: "userId", alias: "u", type: String, description: "required"},
  {name: "name", alias: "n", type: String, description: "required"},
  {name: "value", alias: "v", type: Number, description: "required"},
  {name: "imageUrl", alias: "s", type: String},
  {name: "notes", alias: "t", type: String},
  {name: "accounts", alias: "a", type: Array, description: "required"}
]

const usage = commandLineUsage(
  {
    header: "Options",
    optionList: optionDefinitions,
  }
)
console.log(usage)

const {name, value, imageUrl, notes, userId, accounts} = commandLineArgs(optionDefinitions)

if (!userId) throw new Error("userId is required")
if (!name) throw new Error("categoryId is required")
if (!value) throw new Error("value is required")
if (!accounts) throw new Error("accounts is required")


const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)

    const result = await moneyhub.createSavingsGoal({
      name,
      amount: {value},
      imageUrl,
      notes,
      userId,
      accounts: accounts.map(id => ({id}))
    })
    console.log(JSON.stringify(result, null, 2))
  } catch (e) {
    console.log(e)
  }
}

start()
