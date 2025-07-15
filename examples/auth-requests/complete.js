const qs = require("querystring")
const {Moneyhub} = require("../../src/index")
const config = require("../config")
const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")

// The query / hash fragrment received from the bank
const query = "code=embHXV48x9h2CGdIX_z9Pj5nQdDeKU7FtFOXsImBK-T&state=obmockaspsp__fc05e6da-5cb8-4512-ad8e-8f5bb8ae5548__686e45621218faf1a3aad014"
const authRequestId = "dd96c525-5e0a-49af-afe8-167c609a6853"

const optionDefinitions = [
  {name: "auth-request-id", alias: "i", type: String, description: "required"},
  {name: "auth-params", alias: "p", type: String, description: "required"},
]

const usage = commandLineUsage({
  header: "Options",
  optionList: optionDefinitions,
})
console.log(usage)

const options = commandLineArgs(optionDefinitions)

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)
    const authParams = qs.parse(options["auth-params"] || query)

    const data = await moneyhub.completeAuthRequest({
      id: options["auth-request-id"] || authRequestId,
      authParams,
    })
    console.log(data)
  } catch (e) {
    console.log(e)
  }
}

start()
