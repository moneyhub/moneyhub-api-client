const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")
const Moneyhub = require("../src/index")
const config = require("./config")

const optionDefinitions = [
  {name: "key-alg", type: String},
  {name: "key-use", type: String},
  {name: "key-size", type: Number},
  {name: "alg", type: String},
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

    const jwks = await moneyhub.createJWKS({
      keyAlg: options["key-alg"],
      keySize: options["key-size"],
      keyUse: options["key-use"],
      alg: options.alg,
    })

    console.log("Public keys")
    console.log("This can be used as the jwks in your API client configuration in the Moneyhub Admin portal")
    console.log(JSON.stringify(jwks.public, null, 4))
    console.log("Private keys")
    console.log("This can be used as the keys value when configuring the moneyhub api client")
    console.log(JSON.stringify(jwks.private, null, 4))

  } catch (e) {
    console.log(e)
  }
}

start()
