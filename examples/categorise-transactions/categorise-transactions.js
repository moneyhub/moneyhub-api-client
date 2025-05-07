const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")
const {Moneyhub} = require("../../src/index")
const config = require("../config")

const optionDefinitions = [
  {name: "accountId", alias: "a", type: String},
  {name: "accountType", alias: "t", type: String},
]

const usage = commandLineUsage(
  {
    header: "Options",
    optionList: optionDefinitions,
  }
)

console.log(usage)

const options = commandLineArgs(optionDefinitions)

const transactions = [
  {
    id: "b72f2a5d-c43f-4db1-8143-6f6682ac132c",
    description: "Amazon",
    amount: {
      value: -3000,
    },
    date: "2025-05-02T15:50:19.603Z",
    proprietaryTransactionCode: "DEBIT",
    merchantCategoryCode: "OT42"
  },
  {
    id: "b72f2a5d-c43f-4db1-8143-6f6682ac133c",
    description: "Tesco",
    amount: {
      value: -3000,
    },
    date: "2025-05-02T15:50:19.603Z",
    proprietaryTransactionCode: "DEBIT",
    merchantCategoryCode: "OT42"
  },
]

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)

    const result = await moneyhub.categoriseTransactions({
      accountId: options.accountId,
      accountType: options.accountType,
      transactions
    })
    console.log(JSON.stringify(result, null, 2))
  } catch (e) {
    console.log(e)
  }
}

start()
