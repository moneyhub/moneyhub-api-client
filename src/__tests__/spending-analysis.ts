import {expect} from "chai"
import {expectTypeOf} from "expect-type"

import {Moneyhub, MoneyhubInstance, SpendingAnalysis} from ".."

describe("Spending analysis", function() {
  let moneyhub: MoneyhubInstance
  let userId: string

  before(async function() {
    moneyhub = await Moneyhub(this.config)
    userId = this.config.testUserId
  })

  it("can get spending analysis for a date range", async function() {
    const endDate = new Date()
    const startDate = new Date(endDate)
    startDate.setMonth(startDate.getMonth() - 1)
    const dates = [
      {
        name: "period",
        from: startDate.toISOString().split("T")[0],
        to: endDate.toISOString().split("T")[0],
      },
    ]
    const result = await moneyhub.getSpendingAnalysis({userId, dates})
    expect(result).to.have.property("data")
    expect(result.data).to.have.property("categories")
    expect(result.data).to.have.property("total")
    expectTypeOf<SpendingAnalysis.SpendingAnalysis>(result.data)
  })

  it("can get spending analysis with accountIds filter", async function() {
    const accountId = this.config.testAccountId
    const endDate = new Date()
    const startDate = new Date(endDate)
    startDate.setMonth(startDate.getMonth() - 1)
    const dates = [
      {
        name: "period",
        from: startDate.toISOString().split("T")[0],
        to: endDate.toISOString().split("T")[0],
      },
    ]
    const result = await moneyhub.getSpendingAnalysis({userId, dates, accountIds: [accountId]})
    expect(result.data).to.have.property("categories")
    expect(result.data).to.have.property("total")
  })
})
