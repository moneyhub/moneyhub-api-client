const Moneyhub = require("../../src/index")
const config = require("../config")

const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")

const optionDefinitions = [
  {name: "id", alias: "i", type: String, description: "required"},
]

const usage = commandLineUsage({
  header: "Options",
  optionList: optionDefinitions,
})
console.log(usage)

const options = commandLineArgs(optionDefinitions)

const {id} = options

if (!id) throw new Error("Id is required")

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)
    const data = await moneyhub.getAuthRequest({
      id,
    })
    console.log(data)
  } catch (e) {
    console.log(e)
  }
}

start()
