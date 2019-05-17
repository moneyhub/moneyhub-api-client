const Moneyhub = require("../../src/index")
const config = require("../config")

const {DEFAULT_STATE, DEFAULT_DATA_SCOPES_USE_CASE_2} = require("../constants")

const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")

const optionDefinitions = [
  {name: "state", alias: "s", defaultValue: DEFAULT_STATE, type: String},
  {name: "data-scopes", alias: "d", defaultValue: DEFAULT_DATA_SCOPES_USE_CASE_2, type: String},
]

const usage = commandLineUsage(
  {
    header: "Options",
    optionList: optionDefinitions,
  }
)
console.log(usage)

const options = commandLineArgs(optionDefinitions)
const {state, "data-scopes": dataScopes} = options

const scope =  `openid id:all ${dataScopes}`

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
