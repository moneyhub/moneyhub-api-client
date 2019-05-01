const Moneyhub = require("../../src/index")
const config = require("../config")

const {DEFAULT_BANK_ID, DEFAULT_STATE, DEFAULT_NONCE} = require("../constants")

console.log("\n\nUsage: `node get-authorize-url-for-user.js userId bankId[optional] state[optional] nonce[optional]` \n\n")

const [userId, bankId = DEFAULT_BANK_ID, state = DEFAULT_STATE, nonce = DEFAULT_NONCE] = process.argv.slice(2)

if (!userId) throw new Error("UserId needs to be provided")

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)

    const data = await moneyhub.getAuthorizeUrlForCreatedUser({
      userId,
      state,
      bankId,
      nonce,
    })
    console.log(data)

  } catch (e) {
    console.log(e)
  }
}

start()
