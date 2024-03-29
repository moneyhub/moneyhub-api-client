const {Moneyhub} = require("../../src/index")
const config = require("../config")
const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")

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

if (!options.userId) throw new Error("userId needs to be provided")

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)

    const data = await moneyhub.createJWTBearerGrantToken({
      sub: options.userId,
    })
    console.log(JSON.stringify(data, null, 2))
  } catch (e) {
    console.log(e)
  }
}

start()
