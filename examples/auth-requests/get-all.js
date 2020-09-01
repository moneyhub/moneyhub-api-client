const Moneyhub = require("../../src/index")
const config = require("../config")

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)
    const data = await moneyhub.getAllAuthRequests({
      limit: 50,
      offset: 0,
    })
    console.log(data)
  } catch (e) {
    console.log(e)
  }
}

start()
