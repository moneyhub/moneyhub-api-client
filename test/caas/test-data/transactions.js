const transactions = [
  {
    transactionId: "08820421-8472-4254-8608-f0d59e3b0a99",
    accountType: "cash",
    txCode: "DEB",
    date: new Date().toISOString(),
    status: "posted",
    description: "Aldi Bristol",
    amount: -45.5,
    currency: "GBP",
    cardPresent: true,
    merchantCategoryCode: "5411",
  },
  {
    transactionId: "3c4e27be-17dd-45e2-9b1e-041623daf123",
    accountType: "cash",
    date: new Date().toISOString(),
    status: "posted",
    description: "Currys PC World 1234",
    amount: -15.99,
    currency: "GBP",
  },
]


module.exports = transactions
