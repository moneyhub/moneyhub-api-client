const {Moneyhub} = require("./src/index")
const jose = require("jose")
const config = require("./examples/config")
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
})

const {
  DEFAULT_NONCE,
  DEFAULT_STATE,
  DEFAULT_BANK_ID,
} = require("./examples/constants")

const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")

const optionDefinitions = [
  {
    name: "account-number",
    alias: "t",
    type: String,
    defaultValue: "12345678",
    description: "required",
  },
  {
    name: "sort-code",
    alias: "c",
    type: String,
    defaultValue: "123456",
    description: "required",
  },
  {
    name: "name",
    alias: "m",
    type: String,
    defaultValue: "test",
    description: "required",
  },
  {name: "external-id", alias: "i", type: String},
  {name: "user-id", alias: "u", type: String},
  {
    name: "state",
    alias: "s",
    defaultValue: DEFAULT_STATE,
    type: String,
    description: "required",
  },
  {name: "nonce", alias: "n", defaultValue: DEFAULT_NONCE, type: String},
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
    name: "bank-id",
    alias: "b",
    defaultValue: DEFAULT_BANK_ID,
    type: String,
    description: "required",
  },
  {name: "payer-id", alias: "p", type: String},
  {name: "account-id", type: String},
]

const usage = commandLineUsage({
  header: "Options",
  optionList: optionDefinitions,
})
console.log(usage)

const options = commandLineArgs(optionDefinitions)

/* eslint-disable max-statements */
const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)

    // const {data: {id}} = await moneyhub.addPayee({
    //   accountNumber: options["account-number"],
    //   sortCode: options["sort-code"],
    //   name: options.name,
    //   externalId: options["external-id"],
    //   userId: options["user-id"],
    // })

    const generatePayee = () => {
      if (options["payee-id"]) return {payeeId: options["payee-id"]}
      if (options["user-id"] && options["account-id"]) return {payeeType: "mh-user-account", payeeId: `${options["user-id"]}:${options["account-id"]}`}
      return {payee: {accountNumber: "12345678", sortCode: "123456", name: "test payee"}}
    }

    console.log(options.amount)
    const url = await moneyhub.getPaymentAuthorizeUrl({
      bankId: options["bank-id"],
      amount: options.amount,
      payeeRef: options["payee-ref"],
      payerRef: options["payer-ref"],
      state: options.state,
      nonce: options.nonce,
      userId: options["user-id"],
      readRefundAccount: true,
      ...generatePayee(),
    })

    console.log("<---CLICK LINK AND GET CODE--->")
    console.log(JSON.stringify(url, null, 2))

    readline.question("Enter Code: ", async (code) => {
      const paramsFromCallback = {
        code,
        state: options.state,
        id_token: undefined,
      }
      const localParams = {
        sub: undefined,
        nonce: options.nonce,
        state: options.state,
      }
      const connection = await moneyhub.exchangeCodeForTokens({
        paramsFromCallback,
        localParams,
      })
      console.log("success")
      console.log(connection)

      const {"mh:payment": paymentId} = jose.decodeJwt(connection.id_token)
      console.log(paymentId)
      const {
        data: {status},
      } = await moneyhub.getPayment({id: paymentId})
      console.log(status)

      readline.close()
    })
  } catch (e) {
    console.log(e)
  }
}

start()
