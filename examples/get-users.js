const Moneyhub = require("../src/index")
const config = require("./config")

console.log("\n\nUsage: `node get-users.js` \n\n")

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)

    const result = await moneyhub.getUsers()
    console.log(JSON.stringify(result, null, 2))
  } catch (e) {
    console.log(e)
  }
}

start()
