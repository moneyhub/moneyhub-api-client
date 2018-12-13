
const jose = require("node-jose")
const keystore = jose.JWK.createKeyStore()


const start = async () => {
  await keystore.generate("RSA", 2048, {use: "sig"})
  const public = keystore.toJSON()
  const private = keystore.toJSON(true)
  console.log(JSON.stringify({public, private}, null, 4))
}

start()
