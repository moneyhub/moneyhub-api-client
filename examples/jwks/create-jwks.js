const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")
const jose = require("jose")

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

// eslint-disable-next-line max-statements
const start = async () => {
  try {
    const keySize = options["key-size"] || 2048
    const keyUse = options["key-use"] || "sig"
    const alg = options.alg || "RS256"

    const {publicKey, privateKey} = await jose.generateKeyPair(alg, {
      extractable: true,
      modulusLength: keySize,
    })

    const exportedPrivateJWT = await jose.exportJWK(privateKey)
    const exportedPublicJWT = await jose.exportJWK(publicKey)

    const kid = await jose.calculateJwkThumbprint(exportedPublicJWT)

    const privateJWT = {...exportedPrivateJWT, kid, use: keyUse, alg}
    const publicJWT = {...exportedPublicJWT, kid, use: keyUse, alg}

    const publicJWKS = {
      keys: [publicJWT]
    }

    const privateJWKS = {
      keys: [privateJWT]
    }

    console.log("Public keys")
    console.log(
      "This can be used as the JWKS in your API client configuration in the Moneyhub Admin portal"
    )
    console.log(JSON.stringify(publicJWKS, null, 4))
    console.log("\n\nPrivate keys")
    console.log(
      "This can be used as the keys value when configuring the moneyhub api client"
    )
    console.log(JSON.stringify(privateJWKS, null, 4))
  } catch (e) {
    console.log(e)
  }
}

start()
