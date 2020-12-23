const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")
const {JWKS} = require("jose")

const optionDefinitions = [
  {name: "key-alg", type: String},
  {name: "key-use", type: String},
  {name: "key-size", type: Number},
  {name: "alg", type: String},
]

const usage = commandLineUsage({
  header: "Options",
  optionList: optionDefinitions,
})
const options = commandLineArgs(optionDefinitions)

console.log(usage)

const start = async () => {
  try {
    const keyAlg = options["key-alg"] || "RSA"
    const keySize = options["key-size"] || 2048
    const keyUse = options["key-use"] || "sig"
    const alg = options.alg || "RS256"
    const keystore = new JWKS.KeyStore()
    await keystore.generate(keyAlg, keySize, {
      alg,
      use: keyUse,
    })

    console.log("Public keys")
    console.log(
      "This can be used as the jwks in your API client configuration in the Moneyhub Admin portal",
    )
    console.log(JSON.stringify(keystore.toJWKS(), null, 4))
    console.log("Private keys")
    console.log(
      "This can be used as the keys value when configuring the moneyhub api client",
    )
    console.log(JSON.stringify(keystore.toJWKS(true), null, 4))
  } catch (e) {
    console.log(e)
  }
}

start()
