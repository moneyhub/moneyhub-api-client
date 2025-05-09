const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")
const fs = require("fs")
const path = require("path")
const {Moneyhub} = require("../../src/index")
const config = require("../config")

const optionDefinitions = [
  {name: "userId", alias: "u", type: String, description: "required"},
  {name: "rentalDataFile", alias: "f", type: String, description: "required"}
]

const usage = commandLineUsage(
  {
    header: "Options",
    optionList: optionDefinitions,
  }
)
console.log(usage)

const options = commandLineArgs(optionDefinitions)

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)

    const rentalData = JSON.parse(fs.readFileSync(path.join(__dirname, options.rentalDataFile)))

    const result = await moneyhub.createRentalRecord({
      userId: options.userId,
      rentalData
    })
    console.log(JSON.stringify(result, null, 2))
  } catch (e) {
    console.log(e)
    console.error(e.response.body)
  }
}

start()
