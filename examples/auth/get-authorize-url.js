const {Moneyhub} = require("../../src/index")
const config = require("../config")

const {DEFAULT_BANK_ID, DEFAULT_STATE, DEFAULT_NONCE, DEFAULT_DATA_SCOPES_USE_CASE_1} = require("../constants")

const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")

const optionDefinitions = [
  {name: "bankId", alias: "b", defaultValue: DEFAULT_BANK_ID, type: String, defaultOption: true},
  {name: "state", alias: "s", defaultValue: DEFAULT_STATE, type: String},
  {name: "nonce", alias: "n", defaultValue: DEFAULT_NONCE, type: String},
  {name: "data-scopes", alias: "d", defaultValue: DEFAULT_DATA_SCOPES_USE_CASE_1, type: String},
  {name: "claims", alias: "c", type: String},
  {name: "enable-async", alias: "e", type: Boolean},
]

const usage = commandLineUsage(
  {
    header: "Options",
    optionList: optionDefinitions,
  }
)
console.log(usage)

const options = commandLineArgs(optionDefinitions)

const claims = options.claims && JSON.parse(options.claims)
const {state, bankId, nonce, "data-scopes": dataScopes, "enable-async": enableAsync} = options

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)
    const data = await moneyhub.getAuthorizeUrl({
      state,
      nonce,
      scope: `openid offline_access id:${bankId} ${dataScopes}`,
      claims,
      enableAsync,
    })
    console.log(data)
  } catch (e) {
    console.log(e)
  }
}

start()
