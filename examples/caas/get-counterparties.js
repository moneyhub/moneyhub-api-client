const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")
const {Moneyhub} = require("../../src/index")
const config = require("../config")

const optionDefinitions = [
  {name: "limit", alias: "l", type: Number, description: "optional - Limit number of results"},
  {name: "offset", alias: "o", type: Number, description: "optional - Offset for pagination"},
]

const usage = commandLineUsage(
  {
    header: "Options",
    optionList: optionDefinitions,
  }
)

// example: node caas/get-counterparties.js -l 50 -o 0

console.log(usage)

const options = commandLineArgs(optionDefinitions)

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)
    const result = await moneyhub.caasGetCounterparties({
      limit: options.limit,
      offset: options.offset,
    })
    
    console.log("Counterparties:")
    console.log(JSON.stringify(result, null, 2))
  } catch (e) {
    console.log(e)
    console.error(e.response && e.response.body)
  }
}

start()
