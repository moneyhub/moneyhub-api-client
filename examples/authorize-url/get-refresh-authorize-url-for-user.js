const Moneyhub = require("../../src/index")
const config = require("../config")

const DEFAULT_STATE = "foo"

console.log("\n\nUsage: `node get-refresh-authorize-url-for-user.js userId connectionId state[optional]` \n\n")

const [userId, connectionId, state = DEFAULT_STATE] = process.argv.slice(2)

if (!userId || !connectionId) throw new Error("UserId and connectionId needs to be provided")

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)

    const data = await moneyhub.getRefreshAuthorizeUrlForCreatedUser({
      userId,
      state,
      connectionId,
    })
    console.log(data)

  } catch (e) {
    console.log(e)
  }
}

start()
