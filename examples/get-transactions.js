const Moneyhub = require("../src/index")
const config = require("./config")

console.log("\n\nUsage: `node get-transactions.js token` \n\n")

const [token] = process.argv.slice(2)

if (!token) throw new Error("Token needs to be provided")

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)

    const result = await moneyhub.getTransactions(token)
    console.log(JSON.stringify(result, null, 2))
  } catch (e) {
    console.log(e)
  }
}

start()
