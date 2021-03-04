/* eslint-disable max-statements */
const {JWE, JWKS} = require("jose")
const fs = require("fs")
const got = require("got")
const R = require("ramda")
const config = require("../config")
const run = async () => {
  const file = R.last(process.argv)
  if (!file || file.includes("encrypt.js")) {
    console.log("Please add the file you wish to encrypt as the final argument")
    process.exit(1)
  }
  const fileContents = fs.readFileSync(file).toString()
  console.log(`Encrypting ${file}`)

  console.log("Retreiving Moneyhub encryption key")
  const openidConfig = await got(`${config.identityServiceUrl}/.well-known/openid-configuration`).json()
  const certs = await got(openidConfig.jwks_uri).json()
  const keyStore = JWKS.asKeyStore(certs)
  const key = keyStore.get({use: "enc"})

  if (!key) {
    console.log("No encryption key found")
    process.exit(1)
  }

  console.log(`Encrypting with key id: ${key.kid}`)

  const token = JWE.encrypt(fileContents, key)

  console.log("Encryption complete")
  console.log("--------")
  console.log(token)
  console.log("--------")
}

run()
