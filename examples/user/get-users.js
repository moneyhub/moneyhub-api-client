const {Moneyhub} = require("../../src/index")
const config = require("../config")

const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")

const optionDefinitions = [
  {name: "limit", alias: "l", type: Number, defaultValue: 10},
  {name: "offset", alias: "o", type: Number, defaultValue: 0},
]

const usage = commandLineUsage({
  header: "Options",
  optionList: optionDefinitions,
})

console.log(usage)

const {limit, offset} = commandLineArgs(optionDefinitions)

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)

    const result = await moneyhub.getUsers({limit, offset})
    console.log(JSON.stringify(result, null, 2))
  } catch (e) {
    console.log(e)
    console.error(e.response.body)
  }
}

start()
