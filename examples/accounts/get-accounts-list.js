const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")
const {Moneyhub} = require("../../src/index")
const config = require("../config")

const optionDefinitions = [
  {name: "userId", alias: "u", type: String, description: "required"},
  {name: "limit", alias: "l", type: Number, description: "optional"},
  {name: "offset", alias: "o", type: Number, description: "optional"},
  {name: "showTransactionData", alias: "t", type: String, defaultValue: "false", description: "optional"},
  {name: "showPerformanceScore", alias: "p", type: String, defaultValue: "false", description: "optional"},
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
    const {userId, offset, limit, showPerformanceScore, showTransactionData} = options
    const result = await moneyhub.getAccountsList({userId, params: {offset, limit, showPerformanceScore, showTransactionData}})
    console.log(JSON.stringify(result, null, 2))

  } catch (e) {
    console.log(e)
    console.error(e.response.body)
  }
}

start()
