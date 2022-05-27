const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")
const {Moneyhub} = require("../../src/index")
const config = require("../config")

const optionDefinitions = [
  {name: "userId", alias: "u", type: String, description: "required"},
  {name: "startDate", alias: "s", type: String, description: "required"},
  {name: "endDate", alias: "e", type: String, description: "required"},
  {name: "accountId", alias: "a", type: String},
  {name: "projectId", alias: "p", type: String},
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

    const result = await moneyhub.getTaxReturn({
      userId: options.userId,
      params: {
        startDate: options.startDate,
        endDate: options.endDate,
        accountId: options.accountId,
        projectId: options.projectId,
      }
    })
    console.log(JSON.stringify(result, null, 2))

  } catch (e) {
    console.log(e)
  }
}

start()
