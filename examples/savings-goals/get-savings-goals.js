const {Moneyhub} = require("../../src/index")
const config = require("../config")

const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")

const optionDefinitions = [
  {name: "userId", alias: "u", type: String, description: "required"},
  {name: "limit", alias: "l", type: Number, defaultValue: 10},
  {name: "offset", alias: "o", type: Number, defaultValue: 0},
]

const usage = commandLineUsage({
  header: "Options",
  optionList: optionDefinitions,
})

console.log(usage)

const {limit, offset, userId} = commandLineArgs(optionDefinitions)

if (!userId) throw new Error("userId is required")

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)

    const result = await moneyhub.getSavingsGoals({limit, offset}, userId)
    console.log(JSON.stringify(result, null, 2))
  } catch (e) {
    console.log(e)
  }
}

start()
