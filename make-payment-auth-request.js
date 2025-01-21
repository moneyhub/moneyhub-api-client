const {Moneyhub} = require("./src/index")
const qs = require("querystring")
const config = require("./examples/config")
const {DEFAULT_BANK_ID} = require("./examples/constants")
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout
})

const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")

const defaultPayee = "accountNumber=12345678&sortCode=123456&name=test"

const optionDefinitions = [
  {
    name: "bank-id",
    alias: "b",
    defaultValue: DEFAULT_BANK_ID,
    type: String,
    description: "required",
  },
  {name: "payee-id", alias: "p", type: String},
  {name: "payee", type: String},
  {name: "payee-type", type: String},
  {name: "payer-id", type: String},
  {name: "payer-type", type: String},
  {name: "context", alias: "c", type: String},
  {name: "amount", alias: "a", defaultValue: 100, description: "required"},
  {
    name: "payee-ref",
    alias: "e",
    defaultValue: "Payee ref",
    type: String,
    description: "required",
  },
  {
    name: "payer-ref",
    alias: "r",
    defaultValue: "Payer ref",
    type: String,
    description: "required",
  },
  {
    name: "read-refund-account",
    type: Boolean,
  },
]

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

const usage = commandLineUsage({
  header: "Options",
  optionList: optionDefinitions,
})
const options = commandLineArgs(optionDefinitions)

console.log(usage)
console.log(JSON.stringify(options, null, 2))

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)
    const payee = qs.parse(options.payee || defaultPayee)
    const data = await moneyhub.createAuthRequest({
      scope: `openid payment id:${options["bank-id"]}`,
      payment: {
        amount: options.amount,
        payee,
        payerRef: "testing",
      },
      redirectUri: config.client.redirect_uri,
    })
    console.log(data)
  } catch (e) {
    console.log(e)
    console.log(e.response.body)
  }
}

start()
