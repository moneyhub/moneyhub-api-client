const {Moneyhub} = require("../../src/index")
const config = require("../config")

// Example transaction to enrich
const exampleTransactions = [
  {
    userId: "0a1327eb-26b9-4abc-b932-ff61cb27b227",
    accountId: "10ed62b0-05f7-4a24-8ed1-0c503fc58924",
    transactionId: "a8b7c6d5-e4f3-2a1b-3c4d-5e6f7a8b9c01",
    accountType: "cash",
    txCode: "",
    date: "2025-12-01T00:00:00.000Z",
    status: "posted",
    description: "Tesco Milton Keynes",
    amount: -125.67,
    currency: "GBP",
    merchantCategoryCode: "5411",
    cardPresent: true,
  },
]

const start = async () => {
  try {
    console.log("Enriching transactions...")
    console.log(JSON.stringify(exampleTransactions, null, 2))
    console.log("\n")

    const moneyhub = await Moneyhub(config)
    const result = await moneyhub.caasEnrichTransactions({
      transactions: exampleTransactions,
    })

    console.log("Enriched transactions:")
    console.log(JSON.stringify(result, null, 2))
  } catch (e) {
    console.log(e)
    console.error(e.response && e.response.body)
  }
}

start()
