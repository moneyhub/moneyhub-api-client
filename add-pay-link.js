const {Moneyhub} = require("./src/index")
const config = require("./examples/config")

const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")

const optionDefinitions = [
  {
    name: "widget-id",
    alias: "w",
    type: String,
    defaultValue: "12345678",
    description: "required",
  },
  {
    name: "reference",
    alias: "r",
    type: String,
    defaultValue: "12345678",
  },
  {
    name: "amount",
    alias: "a",
    type: Number,
    defaultValue: 100,
  },
  {
    name: "end-to-end-id",
    alias: "e",
    type: String,
    defaultValue: "e2eid",
  },
  {
    name: "payeeId",
    alias: "p",
    type: String,
    defaultValue: "123124",
  },
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


    const paylink = await moneyhub.addPayLink({
      widgetId: options["widget-id"],
      reference: options.reference,
      amount: options.amount,
      // endToEndId: options["end-to-end-id"],
      payeeId: options.payeeId,
    })
    const widgetUrl = `https://identity.moneyhub.co.uk/widget-pages/${options["widget-id"]}#payLinkId=${paylink.data.id}`
    console.log(paylink)
    console.log(widgetUrl)
  } catch (e) {
    console.log(e)
  }
}

start()
