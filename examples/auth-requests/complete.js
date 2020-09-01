const qs = require("querystring")
const Moneyhub = require("../../src/index")
const config = require("../config")

// The query / hash fragrment received from the bank
const query =
  "code=some-code&state=some-state&id_token=some-id-token"

// The id of the auth request
const id = ""

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)
    const authParams = qs.parse(query)
    const data = await moneyhub.completeAuthRequest({
      id,
      authParams,
    })
    console.log(data)
  } catch (e) {
    console.log(e)
  }
}

start()
