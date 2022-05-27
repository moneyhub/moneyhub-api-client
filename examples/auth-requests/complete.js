const qs = require("querystring")
const {Moneyhub} = require("../../src/index")
const config = require("../config")
const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")

// The query / hash fragrment received from the bank
const query = "state=ozone__782ce284-2d9d-4d79-8eef-361c9d1f9c50__5f60e48cae97c7e72c577f76&code=e337b463-729d-4dbe-a5d0-6bfaed28b343&id_token=eyJhbGciOiJQUzI1NiIsImtpZCI6InprYm9LRmpRUndCZDlVRW5QQzV3bHY1N2lnNCJ9.eyJzdWIiOiJzZHAtMS1lY2ZlOGZkZC03MDhkLTRhZmUtOWRmYS1kODI1NDgzNTIzOWUiLCJvcGVuYmFua2luZ19pbnRlbnRfaWQiOiJzZHAtMS1lY2ZlOGZkZC03MDhkLTRhZmUtOWRmYS1kODI1NDgzNTIzOWUiLCJpc3MiOiJodHRwczovL29iMTktYXV0aDEtdWkubzNiYW5rLmNvLnVrIiwiYXVkIjoiYmYyODhhY2QtOTY4Ny00OGI4LWI4YmYtZDk3MjY0OWVjMDc0IiwiaWF0IjoxNjAwMTg1NTE1LCJleHAiOjE2MDAxODkxMTUsIm5vbmNlIjoiZmNmN2FiMGFmNzg4MGY4ZmI4NjgwNTIyYWM4MmFiM2EiLCJhdXRoX3RpbWUiOjE2MDAxODU1MTUsImF6cCI6ImJmMjg4YWNkLTk2ODctNDhiOC1iOGJmLWQ5NzI2NDllYzA3NCIsInJlZnJlc2hfdG9rZW5fZXhwaXJlc19hdCI6MTYwMDU3NDMxNSwiY19oYXNoIjoiaHlMQk51VGVCNV9HMklFU21HNEFQdyIsInNfaGFzaCI6IjRGSTBpcGZ6OUkwSy14c0VKajExQnciLCJhY3IiOiJ1cm46b3BlbmJhbmtpbmc6cHNkMjpzY2EifQ.QfL6bYAUMFFJ7XcMtQpcKVRx-5-nSSN-yV--c4HKvXb3QitJRCOrXKPwB06HQzCedx51cfejQ_shKqmT96TKUgRr4bpq5WdM7etoklX6PJyU0JZWyvxYf5vkIs3H1kIydIAyVl8e_1Hu1Csgi8zV1tyqnJHjEHsc1BFbeUvwfsUQ9HKosr4_Ce2vaV612YmH57X1d90lRLHs4M7sTrHUDo4BQPELLkVTY8fmd8UMDG1nhn_q40R93Exdg-hw3x_rV9SWBOtcaoilpx1KkCVXPY7eXVomCDnwXDf43RB_FG_WhirivteQrhZhkbqW_RknZaVmXNIyx9AslLEIDXdUSA"
const authRequestId = "a30d8f2e-28fa-4174-a402-fb3ac0e33796"

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
