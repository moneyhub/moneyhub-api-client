const Moneyhub = require("../src/index")
const config = require("./config")


console.log("\n\nUsage: `node create-jwks.js` \n\n")

const [keyAlg, keySize, keyUse, alg] = process.argv.slice(2)

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)

    const jwks = await moneyhub.createJWKS({
      keyAlg,
      keySize,
      keyUse,
      alg,
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
