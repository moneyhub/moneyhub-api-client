const Moneyhub = require("../../src/index")
const config = require("../config")

// The id of the auth request
const id = ""

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)
    const data = await moneyhub.getAuthRequest({
      id,
    })
    console.log(data)
  } catch (e) {
    console.log(e)
  }
}

start()
