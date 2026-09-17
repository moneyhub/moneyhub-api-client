// Local dev only: the mh-environment nginx proxy uses a self-signed cert.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

const {Moneyhub} = require("../../src/index")
const config = require("../config")

const recurringPaymentId = process.argv[2] || "<code goes here>"

const start = async () => {
  if (!recurringPaymentId || recurringPaymentId === "<code goes here>") {
    console.error("Usage: node -r ts-node/register examples/recurring-payments/_vrp-pay.js '<recurring payment id>'")
    return
  }
  try {
    const moneyhub = await Moneyhub(config)
    const result = await moneyhub.makeRecurringPayment({
      recurringPaymentId,
      payment: {
        amount: 500,
        payeeRef: "Sweep payee ref",
        payerRef: "Sweep payer ref",
      },
    })
    console.log("PAYMENT RESULT:\n" + JSON.stringify(result, null, 2))
  } catch (e) {
    console.error("statusCode:", e.response && e.response.statusCode)
    const body = e.response && e.response.body
    console.error("body:", typeof body === "string" ? body : JSON.stringify(body, null, 2))
    if (!e.response) console.error("raw:", e.message || e)
  }
}

start()
