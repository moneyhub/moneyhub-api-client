const Moneyhub = require("../../src/index")
const config = require("../config")
const {DEFAULT_BANK_ID} = require("../constants")

const payeeId = ""
const amount = 1
const redirectUri = "https://tolocalhost.com"

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)
    const data = await moneyhub.createAuthRequest({
      scope: `openid payment id:${DEFAULT_BANK_ID}`,
      payment: {
        payeeId,
        amount,
        payeeRef: "payee-ref",
        payerRef: "payer-ref",
      },
      redirectUri,
    })
    console.log(data)
  } catch (e) {
    console.log(e)
  }
}

start()
