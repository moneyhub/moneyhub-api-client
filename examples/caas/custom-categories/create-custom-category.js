const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")
const {Moneyhub} = require("../../../src/index")
const config = require("../../config")

const optionDefinitions = [
  {name: "userId", alias: "u", type: String, description: "required - User ID"},
  {name: "customCategoryName", alias: "n", type: String, description: "required - custom category name"},
]

const usage = commandLineUsage({
  header: "Options",
  optionList: optionDefinitions,
})

// example: node caas/custom-categories/create-custom-category.js -u userId -n "Coffee"

console.log(usage)

const options = commandLineArgs(optionDefinitions)

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)
    const result = await moneyhub.caasCreateCustomCategory({
      userId: options.userId,
      customCategoryName: options.customCategoryName,
    })
    console.log(JSON.stringify(result, null, 2))
  } catch (e) {
    console.log(e)
    console.error(e.response && e.response.body)
  }
}

start()
