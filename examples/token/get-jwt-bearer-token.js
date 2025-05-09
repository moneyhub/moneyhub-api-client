const {Moneyhub} = require("../../src/index")
const config = require("../config")
const {DEFAULT_DATA_SCOPES_USE_CASE_2} = require("../constants")
const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")

const optionDefinitions = [
  {name: "userId", alias: "u", type: String, description: "required"},
  {name: "scopes", alias: "s", defaultValue: DEFAULT_DATA_SCOPES_USE_CASE_2, type: String},
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

    const data = await moneyhub.getJWTBearerToken({
      scope: options.scopes,
      sub: options.userId,
    })
    console.log(JSON.stringify(data, null, 2))
  } catch (e) {
    console.log(e)
    console.error(e.response.body)
  }
}

start()
