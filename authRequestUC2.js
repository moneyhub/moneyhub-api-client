const {Moneyhub} = require("./src/index")
const config = require("./examples/config")
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout
})

const {DEFAULT_BANK_ID} = require("./examples/constants")

const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")

const optionDefinitions = [
  {name: "bankId", alias: "b", defaultValue: DEFAULT_BANK_ID, type: String},
  {name: "userId", alias: "u", type: String},
  {name: "permissions", alias: "p", description: "comma separated extra permissions", type: String},
  {name: "async", alias: "a", description: "enable async?", type: String},
]

const usage = commandLineUsage(
  {
    header: "Options",
    optionList: optionDefinitions,
  }
)
console.log(usage)

const options = commandLineArgs(optionDefinitions)
const {userId, bankId, permissions, async} = options

const askQuestions = () => {
  const answers = {}

  return new Promise((resolve) => {
    readline.question("Enter Code: ", (code) => {
      answers.code = code
      resolve()
    })
  })
    .then(() => {
      return new Promise((resolve) => {
        readline.question("Enter State: ", (state) => {
          answers.state = state
          resolve()
        })
      })
    })
    .then(() => {
      return new Promise((resolve) => {
        readline.question("Enter Id Token: ", (idToken) => {
          answers.idToken = idToken
          resolve()
        })
      })
    })
    .then(() => {
      readline.close()
      return answers
    })
}

/* eslint-disable max-statements */
const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)
    const clientUserId = "someUserId"
    const verifyUserId = userId
      ? {userId}
      : await moneyhub.registerUser({clientUserId})
    console.log(`UserId: ${verifyUserId.userId}`)
    console.log({...(async ? {sync: {enableAsync: !!async}} : {})})

    const {data: {id, redirectParams: {authUrl}}} = await moneyhub.createAuthRequest({
      scope: `openid id:${bankId}`,
      redirectUri: config.client.redirect_uri,
      userId,
      permissions: permissions && permissions.split(","),
      ...(async ? {sync: {enableAsync: !!async}} : {}),
    })

    console.log({id})
    console.log("<---VISIT THIS URL--->")
    console.log(JSON.stringify(authUrl, null, 2))
    console.log("\n\n")


    const {code, state, idToken} = await askQuestions()
    const data = await moneyhub.completeAuthRequest({
      id,
      authParams: {code, state, id_token: idToken},
    })
    console.log(data)

  } catch (e) {
    console.log(e)
  }
}

start()
