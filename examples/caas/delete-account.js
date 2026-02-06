const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")
const {Moneyhub} = require("../../src/index")
const config = require("../config")

const optionDefinitions = [
  {name: "accountId", alias: "a", type: String, description: "required - Account ID to delete"},
]

const usage = commandLineUsage(
  {
    header: "Options",
    optionList: optionDefinitions,
  }
)

// example: node caas/delete-account.js -a 10ed62b0-05f7-4a24-8ed1-0c503fc58924

console.log(usage)

const options = commandLineArgs(optionDefinitions)

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)
    await moneyhub.caasDeleteAccount({
      accountId: options.accountId,
    })
    console.log(`Account ${options.accountId} deleted successfully`)
  } catch (e) {
    console.log(e)
    console.error(e.response && e.response.body)
  }
}

start()
