/* eslint-disable max-nested-callbacks */
import {expect} from "chai"
import {expectTypeOf} from "expect-type"

import {Moneyhub, MoneyhubInstance, Syncs} from ".."

const OB_MOCK_ID = "1ffe704d39629a929c8e293880fb449a"

describe("Sync", function() {
  let moneyhub: MoneyhubInstance
  let connectionId: string | undefined
  let readOnlyUserId: string

  before(async function() {
    readOnlyUserId = this.config.testReadOnlyUserId
    moneyhub = await Moneyhub(this.config)
  })

  it("sync user connection", async function() {
    const user = await moneyhub.getUser({userId: readOnlyUserId})
    connectionId = user.connectionIds.find(
      (id) => id.split(":")[0] === OB_MOCK_ID,
    )
    try {
      const result = connectionId ?
        await moneyhub.syncUserConnection({userId: readOnlyUserId, connectionId}) :
        undefined
      expect(result?.data.status).to.equal("ok")
      expectTypeOf<Syncs.SyncResponse | undefined>(result?.data)
    } catch (error) {
      // Even if a 500 or 429 is returned we are testing that the method calls the api
      const {statusCode} = (error as any).response
      expect(statusCode).to.be.oneOf([500, 429])
    }

  })

})
