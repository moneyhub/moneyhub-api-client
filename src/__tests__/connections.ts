/* eslint-disable max-nested-callbacks */
import {expectTypeOf} from "expect-type"
import {DateTime} from "luxon"
import {Moneyhub, MoneyhubInstance} from ".."

const OB_MOCK_ID = "1ffe704d39629a929c8e293880fb449a"

describe("Update user connection", function() {
  let moneyhub: MoneyhubInstance
  let connectionId: string | undefined
  let readOnlyUserId: string

  before(async function() {
    readOnlyUserId = this.config.testReadOnlyUserId
    moneyhub = await Moneyhub(this.config)
  })

  it("update user connection", async function() {
    const user = await moneyhub.getUser({userId: readOnlyUserId})
    connectionId = user.connectionIds.find(
      (id) => id.split(":")[0] === OB_MOCK_ID,
    )
    const expiresAt = DateTime.now().plus({days: 90}).toISO()
    const result = connectionId && expiresAt ?
      await moneyhub.updateUserConnection({userId: readOnlyUserId, connectionId, expiresAt}) :
      undefined
    expectTypeOf<number | undefined>(result)

  })

})
