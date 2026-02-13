import {expect} from "chai"

import {Moneyhub, MoneyhubInstance} from ".."

describe("Standard financial statements", function() {
  let moneyhub: MoneyhubInstance
  let userId: string

  before(async function() {
    moneyhub = await Moneyhub(this.config)
    userId = this.config.testUserId
  })

  it("can list standard financial statements for the test user", async function() {
    try {
      const result = await moneyhub.getStandardFinancialStatements({userId})
      expect(result).to.have.property("data")
      expect(Array.isArray(result.data)).to.be.true
    } catch (e: any) {
      if (e.response?.statusCode === 403 || e.error === "insufficient_scope" || e.message?.includes("scope")) {
        this.skip()
      }
      throw e
    }
  })

  it("can list with limit and offset", async function() {
    try {
      const result = await moneyhub.getStandardFinancialStatements({userId, params: {limit: 5, offset: 0}})
      expect(result.data.length).to.be.at.most(5)
    } catch (e: any) {
      if (e.response?.statusCode === 403 || e.error === "insufficient_scope" || e.message?.includes("scope")) {
        this.skip()
      }
      throw e
    }
  })

  it("can get a single standard financial statement when reportId is available", async function() {
    try {
      const list = await moneyhub.getStandardFinancialStatements({userId, params: {limit: 1}})
      if (list.data.length === 0) {
        this.skip()
      }
      const reportId = list.data[0].id
      const one = await moneyhub.getStandardFinancialStatement({userId, reportId})
      expect(one.data).to.have.property("id", reportId)
    } catch (e: any) {
      if (e.response?.statusCode === 403 || e.response?.statusCode === 404 || e.error === "insufficient_scope" || e.message?.includes("scope")) {
        this.skip()
      }
      throw e
    }
  })
})
