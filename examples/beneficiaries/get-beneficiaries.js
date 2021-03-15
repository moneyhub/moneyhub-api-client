const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")
const Moneyhub = require("../../src/index")
const config = require("../config")

const optionDefinitions = [
  {name: "userId", alias: "u", type: String, description: "required"},
  {name: "limit", alias: "l", type: Number, defaultValue: 10},
  {name: "offset", alias: "o", type: Number, defaultValue: 0},
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

    const result = await moneyhub.getBeneficiaries({
      params: {
        limit: options.limit,
        offset: options.offset,
      },
      userId: options.userId,
    })
    console.log(JSON.stringify(result, null, 2))
  } catch (e) {
    console.log(e)
  }
}

start()
