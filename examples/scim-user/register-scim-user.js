const {Moneyhub} = require("../../src/index")
const config = require("../config")
const crypto = require("crypto")

function generateRandomId(length) {
  return crypto.randomBytes(length).toString("hex")
}

const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")

const optionDefinitions = [
  {name: "externalId", alias: "i", defaultValue: generateRandomId(16), type: String, description: "required"},
  {name: "familyName", alias: "f", defaultValue: "Taylor", type: String, description: "required"},
  {name: "givenName", alias: "n", defaultValue: "Alex", type: String, description: "required"},
  {name: "email", alias: "e", type: String, description: "required"},
]

const usage = commandLineUsage(
  {
    header: "Options",
    optionList: optionDefinitions,
  }
)
console.log(usage)

const {externalId, familyName, givenName, email} = commandLineArgs(optionDefinitions)

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)

    const user = await moneyhub.registerSCIMUser({
      externalId,
      name: {
        familyName,
        givenName,
      },
      emails: [
        {
          value: email,
        },
      ],
    })
    console.log(JSON.stringify(user, null, 2))

  } catch (e) {
    console.log(e)
  }
}

start()
