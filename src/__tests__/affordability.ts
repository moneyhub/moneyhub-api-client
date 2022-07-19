import {expect} from "chai"
import {expectTypeOf} from "expect-type"

import {Moneyhub, MoneyhubInstance, Affordability} from ".."

describe.skip("affordability", () => {
  let userId: string
  let affordabilityId: string
  let moneyhub: MoneyhubInstance

  before(async function() {
    const {testUserId} = this.config
    userId = testUserId

    moneyhub = await Moneyhub(this.config)
  })

  it("create affordability", async () => {
    const {data, meta, links} = await moneyhub.createAffordability({userId})

    expect(links).property("self").a("string")
    expect(meta).property("correlationId").a("string")
    expect(data).property("id").a("string")

    affordabilityId = data.id

    expectTypeOf<Affordability.Affordability>(data)
  })

  it("get affordability", async () => {
    const {data, meta, links} = await moneyhub.getAffordability({userId, id: affordabilityId})

    expect(links).property("self").a("string")
    expect(meta).property("correlationId").a("string")
    expect(data).property("id", affordabilityId)
    expectTypeOf<Affordability.Affordability>(data)
  })

  it("get all affordability", async () => {
    const {data, meta, links} = await moneyhub.getAllAffordability({userId, limit: 10, offset: 0})

    expect(links).property("self").a("string")
    expect(meta).property("correlationId").a("string")
    expect(data).nested.property("0.id", affordabilityId)
    expectTypeOf<Affordability.AffordabilityMetadata[]>(data)
  })
})
