const Moneyhub = require("../../src/index")
const config = require("../config")

console.log("\n\nUsage: `node get-token-using-refresh-token.js refreshToken` \n\n")

const [
  refreshToken,
] = process.argv.slice(2)

if (!refreshToken) throw new Error("refreshToken needs to be provided")

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)
    const data = await moneyhub.refreshTokens(refreshToken)
    console.log(data)

  } catch (e) {
    console.log(e)
  }
}

start()
