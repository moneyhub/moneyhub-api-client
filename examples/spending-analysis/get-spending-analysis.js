const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")
const {Moneyhub} = require("../../src/index")
const config = require("../config")

const optionDefinitions = [
  {name: "userId", alias: "u", type: String, description: "required"},
]

const usage = commandLineUsage(
  {
    header: "Options",
    optionList: optionDefinitions,
  }
)

console.log(usage)

const options = commandLineArgs(optionDefinitions)

const dates = [
  {
    "name": "currentMonth",
    "from": "2022-04-01",
    "to": "2022-04-30"
  },
  {
    "name": "previousMonth",
    "from": "2021-03-01",
    "to": "2021-03-31"
  }
]

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)

    const result = await moneyhub.getSpendingAnalysis({
      userId: options.userId,
      dates
    })
    console.log(JSON.stringify(result, null, 2))
  } catch (e) {
    console.log(e)
  }
}

start()
