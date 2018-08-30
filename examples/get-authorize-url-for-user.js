const Moneyhub = require("../src/index")
const config = require("./config")

const DEFAULT_BANK_ID = "4ddeccd5a66881eb25223d5ff8b2e2c1"
const DEFAULT_STATE = "foo"

console.log("\n\nUsage: `node get-authorize-url-for-user.js userId bankId[optional] state[optional]` \n\n")

const [userId, bankId = DEFAULT_BANK_ID, state = DEFAULT_STATE] = process.argv.slice(2)

if (!userId) throw new Error("UserId needs to be provided")

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)

    const data = await moneyhub.getAuthorizeUrlForCreatedUser({
      userId,
      state,
      bankId,
    })
    console.log(data)

  } catch (e) {
    console.log(e)
  }
}

start()
