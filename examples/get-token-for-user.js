const Moneyhub = require("../src/index")
const config = require("./config")

const DEFAULT_SCOPES = "accounts:read accounts:write transactions:read:all transactions:write categories:read categories:write"

console.log("\n\nUsage: `node exchange-code.js userId scopes[optional]` \n\n")

const [userId, scopes = DEFAULT_SCOPES] = process.argv.slice(2)

if (!userId) throw new Error("userId needs to be provided")

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)

    const data = await moneyhub.getClientCredentialTokens({
      scope: scopes,
      sub: userId,
    })
    console.log(JSON.stringify(data, null, 2))
  } catch (e) {
    console.log(e)
  }
}

start()
