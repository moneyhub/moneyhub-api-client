const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")
const Moneyhub = require("../../src/index")
const config = require("../config")

const optionDefinitions = [
  {name: "limit", alias: "l", type: Number},
  {name: "offset", alias: "o", type: Number},
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

    const result = await moneyhub.getPayees({
      limit: options.limit,
      offset: options.offset,
    })
    console.log(JSON.stringify(result, null, 2))
  } catch (e) {
    console.log(e)
  }
}

start()
