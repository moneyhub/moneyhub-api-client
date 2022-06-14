/* eslint-disable max-nested-callbacks */
const {Moneyhub} = require("..")
const {expect} = require("chai")

const OB_MOCK_ID = "1ffe704d39629a929c8e293880fb449a"

describe("Sync", () => {
  let config
  let moneyhub
  let connectionId
  let readOnlyUserId

  before(async function() {
    config = this.config
    readOnlyUserId = config.testReadOnlyUserId
    moneyhub = await Moneyhub(config)
  })

  it("sync user connection", async () => {
    const user = await moneyhub.getUser({userId: readOnlyUserId})
    connectionId = user.connectionIds.find(
      (connectionId) => connectionId.split(":")[0] === OB_MOCK_ID
    )
    try {
      const result = await moneyhub.syncUserConnection({userId: readOnlyUserId, connectionId})
      expect(result.data.status).to.equal("ok")
    } catch (error) {
      // Even if a 500 or 429 is returned we are testing that the method calls the api
      const {statusCode} = error.response
      expect(statusCode).to.be.oneOf([500, 429])
    }

  })

})
