const {Moneyhub} = require("../../src/index")
const config = require("../config")

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)

    const result = await moneyhub.listConnections()
    console.log(JSON.stringify(result, null, 2))
  } catch (e) {
    console.log(e)
  }
}

start()
