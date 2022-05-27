const {Moneyhub} = require("../../src/index")
const config = require("../config")
const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")

const optionDefinitions = [
  {name: "refreshToken", alias: "r", type: String, description: "required"},
]

const usage = commandLineUsage(
  {
    header: "Options",
    optionList: optionDefinitions,
  }
)

console.log(usage)

const options = commandLineArgs(optionDefinitions)

if (!options.refreshToken) throw new Error("refreshToken is required")

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)
    const data = await moneyhub.refreshTokens({refreshToken: options.refreshToken})
    console.log(data)

  } catch (e) {
    console.log(e)
  }
}

start()
