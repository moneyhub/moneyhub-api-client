/* eslint-disable max-nested-callbacks */
import {expect} from "chai"

import {Moneyhub, MoneyhubInstance} from ".."

describe("Regular transactions", function() {
  let moneyhub: MoneyhubInstance
  let userId: string
  let accountId: string

  before(async function() {
    userId = this.config.testUserId
    accountId = this.config.testAccountId
    moneyhub = await Moneyhub(this.config)
  })

  describe("Get regular transactions", function() {
    it("is successful", async function() {
      const {data} = await moneyhub.getRegularTransactions({userId})
      expect(data.length).to.eql(0)
    })
  })

  describe("Regular transactions detect", function() {
    it("is successful", async function() {
      const {data} = await moneyhub.detectRegularTransactions({userId, accountId})
      expect(data.length).to.eql(0)
    })
  })

})
