const {Moneyhub} = require("../../src/index")
const config = require("../config")

const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")

const optionDefinitions = [
  {name: "userId", alias: "u", type: String},
  {name: "syncId", alias: "s", type: String},
]

const usage = commandLineUsage({
  header: "Options",
  optionList: optionDefinitions,
})

console.log(usage)

const {syncId, userId} = commandLineArgs(optionDefinitions)

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)

    const result = await moneyhub.getSync({userId, syncId})
    console.log(JSON.stringify(result, null, 2))
  } catch (e) {
    console.log(e)
  }
}

start()
