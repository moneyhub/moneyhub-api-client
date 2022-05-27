const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")
const {Moneyhub} = require("../../src/index")
const config = require("../config")

const optionDefinitions = [
  {name: "limit", alias: "l", type: Number, defaultValue: 10},
  {name: "offset", alias: "o", type: Number, defaultValue: 0},
  {name: "userId", alias: "u", type: String},
  {name: "payeeId", alias: "p", type: String},
  {name: "startDate", alias: "s", type: String},
  {name: "endDate", alias: "e", type: String},
]

const usage = commandLineUsage(
  {
    header: "Options",
    optionList: optionDefinitions,
  }
)
const options = commandLineArgs(optionDefinitions)

console.log(usage)

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)

    const result = await moneyhub.getStandingOrders({
      limit: options.limit,
      offset: options.offset,
      userId: options.userId,
      payeeId: options.payeeId,
      startDate: options.startDate,
      endDate: options.endDate,
    })
    console.log(JSON.stringify(result, null, 2))
  } catch (e) {
    console.log(e)
  }
}

start()
