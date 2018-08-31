const Moneyhub = require("../src/index")
const config = require("./config")

console.log("\n\nUsage: `node get-user.js userId` \n\n")

const [userId] = process.argv.slice(2)

if (!userId) throw new Error("userId needs to be provided")

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)

    const result = await moneyhub.getUser(userId)
    console.log(JSON.stringify(result, null, 2))
  } catch (e) {
    console.log(e)
  }
}

start()
