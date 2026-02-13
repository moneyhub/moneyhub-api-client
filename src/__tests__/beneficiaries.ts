import {expect} from "chai"
import {expectTypeOf} from "expect-type"

import {Moneyhub, MoneyhubInstance, Beneficiaries} from ".."

describe("Beneficiaries", function() {
  let moneyhub: MoneyhubInstance
  let userId: string

  before(async function() {
    moneyhub = await Moneyhub(this.config)
    userId = this.config.testUserId
  })

  it("can get beneficiaries list for the test user", async function() {
    const result = await moneyhub.getBeneficiaries({userId})
    expect(result).to.have.property("data")
    expect(Array.isArray(result.data)).to.be.true
    expectTypeOf<Beneficiaries.Beneficiary[]>(result.data)
  })

  it("can get beneficiaries with limit", async function() {
    const result = await moneyhub.getBeneficiaries({userId, params: {limit: 5}})
    expect(result.data.length).to.be.at.most(5)
  })

  it("can get beneficiaries with detail scope when list has items", async function() {
    const list = await moneyhub.getBeneficiaries({userId, params: {limit: 1}})
    if (list.data.length > 0) {
      const id = list.data[0].id
      const detail = await moneyhub.getBeneficiaryWithDetail({id, userId})
      expect(detail.data).to.have.property("id", id)
      expectTypeOf<Beneficiaries.BeneficiaryWithDetails>(detail.data)
    }
  })
})
