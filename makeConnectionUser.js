const {Moneyhub} = require("./src/index")
const config = require("./examples/config")
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout
})

const {DEFAULT_BANK_ID, DEFAULT_STATE, DEFAULT_NONCE} = require("./examples/constants")

const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")

const optionDefinitions = [
  {name: "bankId", alias: "b", defaultValue: DEFAULT_BANK_ID, type: String},
  {name: "userId", alias: "u", type: String},
  {name: "transactionFromDateTime", alias: "t", type: String},
]

const usage = commandLineUsage(
  {
    header: "Options",
    optionList: optionDefinitions,
  }
)
console.log(usage)

const options = commandLineArgs(optionDefinitions)
const {bankId, userId, transactionFromDateTime} = options

/* eslint-disable max-statements */
const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)
    const clientUserId = "someUserId"
    const state = DEFAULT_STATE
    const nonce = DEFAULT_NONCE
    const scope = "accounts:read accounts:write:all transactions:read:all transactions:write:all categories:read categories:write spending_goals:read spending_goals:write:all savings_goals:read savings_goals:write:all spending_analysis:read projects:read projects:write projects:delete tax:read"
    const verifyUserId = userId
      ? {userId}
      : await moneyhub.registerUser({clientUserId})
    console.log(`UserId: ${verifyUserId.userId}`)
    const verifyTransacFromDate = transactionFromDateTime
      ? new Date(transactionFromDateTime).toISOString()
      : undefined

    const token = await moneyhub.getClientCredentialTokens({
      scope,
      sub: verifyUserId.userId,
    })
    console.log("<---USE THIS TOKEN--->")
    console.log(JSON.stringify(token, null, 2))
    console.log("\n\n")

    // const claims = {
    //   "id_token": {
    //     "mh:sync": {
    //       "essential": true,
    //       "value": {
    //         "enableAsync": true
    //       }
    //     }
    //   }
    // }
    const claims = undefined

    const url = await moneyhub.getAuthorizeUrlForCreatedUser({
      userId: verifyUserId.userId,
      state: DEFAULT_STATE,
      bankId,
      nonce: DEFAULT_NONCE,
      claims,
      transactionFromDateTime: verifyTransacFromDate,
    })

    console.log("<---CLICK LINK AND GET CODE--->")
    console.log(JSON.stringify(url, null, 2))

    readline.question("Enter Code: ", async code => {
      const paramsFromCallback = {
        code,
        state,
        id_token: undefined,
      }
      const localParams = {
        sub: verifyUserId.userId,
        nonce,
        state,
      }
      await moneyhub.exchangeCodeForTokens({
        paramsFromCallback,
        localParams,
      })
      console.log("success")
      readline.close()
    })

  } catch (e) {
    console.log(e)
  }
}

start()
