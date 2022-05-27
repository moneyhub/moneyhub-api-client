const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")
const {Moneyhub} = require("../../src/index")
const config = require("../config")

const optionDefinitions = [
  {name: "projectId", alias: "i", type: String, description: "required"},
  {name: "userId", alias: "u", type: String, description: "required"},
  {name: "name", alias: "n", type: String, description: "required"},
  {name: "type", alias: "t", type: String, description: "required"},
  {name: "accountIds", alias: "a", type: String, description: "required"},
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

    const result = await moneyhub.updateProject({
      userId: options.userId,
      projectId: options.projectId,
      project: {
        name: options.name,
        accountIds: options.accountIds.split(","),
        type: options.type,
        archived: false,
      }
    })

    console.log(result)

  } catch (e) {
    console.log(e)
    console.log(e.response.body)
  }
}

start()
