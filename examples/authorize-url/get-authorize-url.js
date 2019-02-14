const Moneyhub = require("../../src/index")
const config = require("../config")

const {DEFAULT_BANK_ID, DEFAULT_STATE, DEFAULT_DATA_SCOPES_USE_CASE_1} = require("../constants")

console.log(
  "\n\nUsage: `node get-authorize-url.js bankId[optional] state[optional]` \n\n"
)

const [bankId = DEFAULT_BANK_ID, state = DEFAULT_STATE] = process.argv.slice(2)

if (!bankId) throw new Error("bank id needs to be provided")

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)
    const data = await moneyhub.getAuthorizeUrl({
      state,
      scope: `openid offline_access id:${bankId} ${DEFAULT_DATA_SCOPES_USE_CASE_1}`,
    })
    console.log(data)
  } catch (e) {
    console.log(e)
  }
}

start()
