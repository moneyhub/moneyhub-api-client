
const jose = require("node-jose")
const keystore = jose.JWK.createKeyStore()


const start = async () => {
  await keystore.generate("RSA", 2048, {use: "sig"})
  const public = keystore.toJSON()
  const private = keystore.toJSON(true)
  public.keys[0].alg = "RS256"
  console.log("Paste this in the jwks sectio in the admin portal:")
  console.log(JSON.stringify(public, null, 4))
  console.log("---------------")
  console.log("Paste this into the keys section of the config.js file in this repo")
  console.log(JSON.stringify(private.keys, null, 4))

}

start()
