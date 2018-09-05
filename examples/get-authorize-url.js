const Moneyhub = require("../src/index")
const config = require("./config")

const DEFAULT_BANK_ID = "4ddeccd5a66881eb25223d5ff8b2e2c1" // dag bank
// const DEFAULT_BANK_ID = "3f0640be935f170febc1f35afb38a415" // monzo
const DEFAULT_STATE = "foo"
const DEFAULT_DATA_SCOPES = "accounts:read accounts:write transactions:read:all transactions:write categories:read categories:write"

console.log("\n\nUsage: `node get-authorize-url.js bankId[optional] state[optional]` \n\n")

const [
  bankId = DEFAULT_BANK_ID, state = DEFAULT_STATE,
] = process.argv.slice(2)

if (!bankId) throw new Error("bank id needs to be provided")

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)
    const data = await moneyhub.getAuthorizeUrl({
      state,
      scope: `openid offline_access id:${bankId} ${DEFAULT_DATA_SCOPES}`,
      claims: {
        "id_token": {
          "mh:income_level": {essential: true},
          "mh:spending_level": {essential: true},
        },
      }
    })
    console.log(data)

  } catch (e) {
    console.log(e)
  }
}

start()
