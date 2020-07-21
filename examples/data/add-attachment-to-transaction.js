const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")
const Moneyhub = require("../../src/index")
const config = require("../config")
const fs = require("fs")
const path = require("path")

const optionDefinitions = [
  {name: "userId", alias: "u", type: String, description: "required"},
  {name: "transactionId", alias: "t", type: String, description: "required"},
  {name: "filePath", alias: "f", type: String, description: "required"},
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
    const filePath = path.resolve(process.cwd(), options.filePath)
    const fileData = fs.createReadStream(filePath)
    const result = await moneyhub.addFileToTransaction(options.userId, options.transactionId, fileData)
    console.log(JSON.stringify(result, null, 2))
  } catch (e) {
    console.log(e)
  }
}

start()
