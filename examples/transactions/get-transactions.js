const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")
const Moneyhub = require("../../src/index")
const config = require("../config")
const R = require("ramda")

const optionDefinitions = [
  {name: "userId", alias: "u", type: String, description: "required"},
  {name: "accountId", alias: "a", type: String},
  {name: "categoryId", alias: "c", type: String},
  {name: "projectId", alias: "p", type: String},
  {name: "startDate", alias: "s", type: String},
  {name: "endDate", alias: "e", type: String},
  {name: "limit", alias: "l", type: Number},
  {name: "offset", alias: "o", type: Number},
  {name: "counterpartiesVersion", alias: "v", type: String, description: "required"},
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

    const result = await moneyhub.getTransactions({
      userId: options.userId,
      params: R.omit(["userId"], options)
    })
    console.log(JSON.stringify(result, null, 2))
  } catch (e) {
    console.log(e)
    console.log(e.response.body)
  }
}

start()
