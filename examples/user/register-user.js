const Moneyhub = require("../../src/index")
const config = require("../config")

const DEFAULT_CLIENT_USER_ID = "some-client-user-id"

console.log("\n\nUsage: `node register-user.js clientUserId[optional]` \n\n")

const [clientUserId = DEFAULT_CLIENT_USER_ID] = process.argv.slice(2)

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)

    const user = await moneyhub.registerUser(clientUserId)
    console.log(JSON.stringify(user, null, 2))

  } catch (e) {
    console.log(e)
  }
}

start()
