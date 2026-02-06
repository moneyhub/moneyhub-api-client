const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")
const {Moneyhub} = require("../../src/index")
const config = require("../config")

const optionDefinitions = [
  {name: "userId", alias: "u", type: String, description: "required - User ID to delete"},
]

const usage = commandLineUsage(
  {
    header: "Options",
    optionList: optionDefinitions,
  }
)

// example: node caas/delete-user.js -u 0a1327eb-26b9-4abc-b932-ff61cb27b227

console.log(usage)

const options = commandLineArgs(optionDefinitions)

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)
    await moneyhub.caasDeleteUser({
      userId: options.userId,
    })
    console.log(`User ${options.userId} deleted successfully`)
  } catch (e) {
    console.log(e)
    console.error(e.response && e.response.body)
  }
}

start()
