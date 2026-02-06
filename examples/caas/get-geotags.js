const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")
const {Moneyhub} = require("../../src/index")
const config = require("../config")

const optionDefinitions = [
  {name: "geotagIds", alias: "g", type: String, multiple: true, description: "required - Geotag IDs (can specify multiple)"},
]

const usage = commandLineUsage(
  {
    header: "Options",
    optionList: optionDefinitions,
  }
)

// example: node caas/get-geotags.js -g geotag-id-1 -g geotag-id-2

console.log(usage)

const options = commandLineArgs(optionDefinitions)

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)
    const result = await moneyhub.caasGetGeotags({
      geotagIds: options.geotagIds || [],
    })
    
    console.log("Geotags:")
    console.log(JSON.stringify(result, null, 2))
  } catch (e) {
    console.log(e)
    console.error(e.response && e.response.body)
  }
}

start()
