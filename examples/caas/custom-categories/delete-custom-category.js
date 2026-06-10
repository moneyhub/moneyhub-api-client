const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")
const {Moneyhub} = require("../../../src/index")
const config = require("../../config")

const optionDefinitions = [
  {name: "userId", alias: "u", type: String, description: "required - User ID"},
  {name: "categoryId", alias: "c", type: String, description: "required - custom category ID (UUID)"},
]

const usage = commandLineUsage({
  header: "Options",
  optionList: optionDefinitions,
})

// example: node caas/custom-categories/delete-custom-category.js -u userId -c categoryId

console.log(usage)

const options = commandLineArgs(optionDefinitions)

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)
    await moneyhub.caasDeleteCustomCategory({
      userId: options.userId,
      categoryId: options.categoryId,
    })
    console.log(`Custom category ${options.categoryId} deleted successfully`)
  } catch (e) {
    console.log(e)
    console.error(e.response && e.response.body)
  }
}

start()
