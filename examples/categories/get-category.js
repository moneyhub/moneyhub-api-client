const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")
const {Moneyhub} = require("../../src/index")
const config = require("../config")

const optionDefinitions = [
  {name: "userId", alias: "u", type: String, description: "required"},
  {name: "categoryId", alias: "c", type: String},
]

const usage = commandLineUsage(
  {
    header: "Options",
    optionList: optionDefinitions,
  }
)
console.log(usage)

const {userId, categoryId} = commandLineArgs(optionDefinitions)


const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)

    const result = await moneyhub.getCategory({userId, categoryId})
    console.log(JSON.stringify(result, null, 2))

  } catch (e) {
    console.log(e)
  }
}

start()
