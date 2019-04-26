const Moneyhub = require("../../src/index")
const config = require("../config")

console.log("\n\nUsage: `node get-user-connections.js userId` \n\n")

const [userId] = process.argv.slice(2)

if (!userId) throw new Error("userId needs to be provided")

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)

    const response = await moneyhub.getUserConnections(userId)
    console.log(JSON.stringify({statusCode: response.statusCode}, null, 2))

  } catch (e) {
    console.log(e)
  }
}

start()
