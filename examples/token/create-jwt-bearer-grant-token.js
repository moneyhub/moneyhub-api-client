const {Moneyhub} = require("../../src/index")
const config = require("../config")
const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")

const optionDefinitions = [
  {name: "subject", alias: "s", type: String, description: "required (can be userId or clientId)"},
]

const usage = commandLineUsage({
  header: "Options",
  optionList: optionDefinitions,
})

console.log(usage)

const options = commandLineArgs(optionDefinitions)

if (!options.subject) throw new Error("subject (userId or clientId) needs to be provided")

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)

    const data = await moneyhub.createJWTBearerGrantToken(options.subject)
    console.log(JSON.stringify(data, null, 2))
  } catch (e) {
    console.log(e)
  }
}

start()
