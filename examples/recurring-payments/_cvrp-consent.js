// Local dev only: the mh-environment nginx proxy uses a self-signed cert.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

const {Moneyhub} = require("../../src/index")
const config = require("../config")

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)
    const url = await moneyhub.getRecurringPaymentAuthorizeUrl({
      bankId: "<code goes here>",
      payee: {
        name: "<payee name>",
        accountNumber: "<account number>",
        sortCode: "<sort code>",
      },
      reference: "CVRP test",
      maximumIndividualAmount: 1000,
      currency: "GBP",
      periodicLimits: [
        {
          amount: 5000,
          currency: "GBP",
          periodType: "Month",
          periodAlignment: "Consent",
        },
      ],
      // Commercial VRP. identity accepts this via additionalRecurringPaymentTypes.
      type: "cvrp",
      context: "PartyToParty",
      state: "foo",
      nonce: "bar",
    })
    console.log("CONSENT URL:\n" + url)
  } catch (e) {
    console.error("statusCode:", e.response && e.response.statusCode)
    const body = e.response && e.response.body
    console.error(
      "body:",
      typeof body === "string" ? body : JSON.stringify(body, null, 2),
    )
    if (!e.response) console.error("raw:", e.message || e)
  }
}

start()
