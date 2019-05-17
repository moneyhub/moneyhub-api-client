const Moneyhub = require("../../src/index")
const config = require("../config")

const {DEFAULT_STATE, DEFAULT_NONCE} = require("../constants")

console.log("\n\nUsage: `node get-reauth-authorize-url-for-user.js userId connectionId state[optional]` \n\n")

const [userId, connectionId, state = DEFAULT_STATE, nonce = DEFAULT_NONCE] = process.argv.slice(2)

if (!userId || !connectionId) throw new Error("UserId and connectionId needs to be provided")

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)

    const data = await moneyhub.getReauthAuthorizeUrlForCreatedUser({
      userId,
      state,
      nonce,
      connectionId,
    })
    console.log(data)

  } catch (e) {
    console.log(e)
  }
}

start()
