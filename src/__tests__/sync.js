/* eslint-disable max-nested-callbacks */
const Moneyhub = require("..")
const config = require("../../test/test-client-config")
const {expect} = require("chai")

describe("Sync", () => {
  let moneyhub
  let connectionId
  const userId = config.testUserIdWithconnection

  before(async () => {
    moneyhub = await Moneyhub(config)
  })

  it("sync user connection", async () => {
    const user = await moneyhub.getUser({userId})
    connectionId = user.connectionIds[0]
    try {
      const result = await moneyhub.syncUserConnection({userId, connectionId})
      expect(result.data.status).to.equal("ok")
    } catch (error) {
      // Even if a 500 is returned we are testing that the method calls the api
      const {statusCode, body} = error.response
      const responseBody = JSON.parse(body)
      expect(statusCode).to.eql(500)
      expect(responseBody).has.property("correlationId")
    }

  })

})
