const qs = require("querystring")
const {Moneyhub} = require("../../src/index")
const config = require("../config")
const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")

// The query / hash fragrment received from the bank
const query = "state=obmockaspsp__ad138967-c26b-431f-9abc-e8d72de23a3a__68d169c09c61485a6da72872&code=xbB4p2LT-kfsAxaJVQwMTWl2KY3kyzsW2PdM-cejbwU&id_token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InFFbWF1dDA4czdtaTdJMXRCaG13cXJqUGNSX1lvQUlMWGJiS1pqM093dG8ifQ.eyJodHRwOi8vb3BlbmJhbmtpbmcub3JnLnVrL3JlZnJlc2hfdG9rZW5fZXhwaXJlc19hdCI6MTgwMDExMTU3MSwic3ViIjoiZWI1NWIwMzgtMjYyNS00YWM4LWJhOTEtYzY0NmZmMmQ3ODgzIiwib3BlbmJhbmtpbmdfaW50ZW50X2lkIjoiZWI1NWIwMzgtMjYyNS00YWM4LWJhOTEtYzY0NmZmMmQ3ODgzIiwibm9uY2UiOiI1ZjhlMDcwOTJmZDU0Y2ZhMzg3YWYwYjkwYTM0MWMyYiIsImNfaGFzaCI6IjRCOExGRUZETmdIVFh2bkh4Yl82SUEiLCJzX2hhc2giOiJwVm54T09lUGloVkRqaUdVampCbHRBIiwiYXVkIjoiMGRlMWU4MTMtYmYzNy00ZmE4LTk5NDMtMWFlZWRiYzgzMzYwIiwiZXhwIjoxNzU4NTU1MTcxLCJpYXQiOjE3NTg1NTQ1NzEsImlzcyI6Imh0dHA6Ly9vYm1vY2thc3BzcCJ9.aq1wBoVDbQ0kBReLckWRdBe8cpkhz76YqecIGSKi_xScaTTspnfDyMI_0c2tb3gaFFoJb_RsdnUPtcMtdwUZVfI_B6Gnu0qTJtXDS53CbzAEn11mRS3PlcOctKoXieeCBKSoUdVxZrwwMuH67aUC4CdJkltp6PX4p1ba_2NOnWVjVYKokVyA1uyb1gm2DC1RbE4fVp-mwKnreaq8SzUn8nvvfMgrl8nqRdY4jAnxZuIY9g9TlfDZsCajykley8UxMm17MaG6r3mDzcjxPa2bt2Vi8ZdKqo1ZsZr3U0OIew0vHp1G4ystPWHNBahmzXEJOHw1Vvg0Zq2p3ZnFq2UeiA"
const authRequestId = "2c445a4d-42b9-41b4-9be5-514326987ca9"

const optionDefinitions = [
  {name: "auth-request-id", alias: "i", type: String, description: "required"},
  {name: "auth-params", alias: "p", type: String, description: "required"},
]

const usage = commandLineUsage({
  header: "Options",
  optionList: optionDefinitions,
})
console.log(usage)

const options = commandLineArgs(optionDefinitions)

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)
    const authParams = qs.parse(options["auth-params"] || query)

    const data = await moneyhub.completeAuthRequest({
      id: options["auth-request-id"] || authRequestId,
      authParams,
    })
    console.log(data)
  } catch (e) {
    console.log(e)
  }
}

start()
