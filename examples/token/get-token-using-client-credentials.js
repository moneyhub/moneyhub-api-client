const Moneyhub = require("../../src/index")
const config = require("../config")

const {DEFAULT_DATA_SCOPES_USE_CASE_2} = require("../constants")

console.log(
  "\n\nUsage: `node get-token-using-client-credentials.js userId scopes[optional]` \n\n"
)

const [userId, scopes = DEFAULT_DATA_SCOPES_USE_CASE_2] = process.argv.slice(2)

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
