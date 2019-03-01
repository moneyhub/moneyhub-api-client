const Moneyhub = require("../../src/index")
const config = require("../config")
const {DEFAULT_DATA_SCOPES_USE_CASE_1} = require("../constants")

console.log("\n\nUsage: `node get-transactions.js userId` \n\n")

const [userId] = process.argv.slice(2)

if (!userId) throw new Error("UserId needs to be provided")

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)

    const tokens = await moneyhub.getClientCredentialTokens({
      scope: DEFAULT_DATA_SCOPES_USE_CASE_1,
      sub: userId,
    })
    console.log(JSON.stringify(tokens, null, 2))
    const {access_token: accessToken} = tokens

    const result = await moneyhub.getTransactions(accessToken)
    console.log(JSON.stringify(result, null, 2))
  } catch (e) {
    console.log(e)
  }
}

start()
