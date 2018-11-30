const Moneyhub = require("../../src/index")
const config = require("../config")


console.log("\n\nUsage: `node delete-user-connection.js userId connectionId` \n\n")

const [userId, connectionId] = process.argv.slice(2)

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)

    const response = await moneyhub.deleteUserConnection(userId, connectionId)
    console.log(JSON.stringify({statusCode: response.statusCode}, null, 2))

  } catch (e) {
    console.log(e)
  }
}

start()
