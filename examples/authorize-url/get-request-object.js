const Moneyhub = require("../../src/index")
const config = require("../config")

const {DEFAULT_STATE, DEFAULT_DATA_SCOPES_USE_CASE_2} = require("../constants")

console.log(
  "\n\nUsage: `node get-request-object.js bankId[optional] state[optional]` \n\n"
)

const [scope =  `openid id:all ${DEFAULT_DATA_SCOPES_USE_CASE_2}`, state = DEFAULT_STATE] = process.argv.slice(2)

const defaultClaims = {
  id_token: {
    sub: {
      essential: true,
    },
    "mh:con_id": {
      essential: true,
    },
  },
}

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)
    const data = await moneyhub.requestObject({
      state,
      scope,
      claims: defaultClaims,
    })
    console.log(data)
  } catch (e) {
    console.log(e)
  }
}

start()
