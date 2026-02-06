const {Moneyhub} = require("../../src/index")
const config = require("../config")

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)
    const result = await moneyhub.caasGetCategories()
    
    console.log("Categories:")
    console.log(JSON.stringify(result, null, 2))
  } catch (e) {
    console.log(e)
    console.error(e.response && e.response.body)
  }
}

start()
