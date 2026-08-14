
import {expect} from "chai"
import {expectTypeOf} from "expect-type"

import {Moneyhub, MoneyhubInstance, SpendingGoals} from "../"

describe("Spending Goals", function() {
  let moneyhub: MoneyhubInstance
  let userId: string
  let goalId: string

  before(async function() {
    userId = this.config.testUserId
    moneyhub = await Moneyhub(this.config)
  })

  it("can create a spending goal", async function() {
    const goal = await moneyhub.createSpendingGoal({
      userId,
      categoryId: "std:all",
      amount: {value: 100},
    })
    goalId = goal.data.id
    expect(goal.data.categoryId).to.equal("std:all")
    expect(goal.data.amount.value).to.equal(100)
    expectTypeOf<SpendingGoals.SpendingGoal>(goal.data)
  })

  it("can get a spending goal", async function() {
    const goal = await moneyhub.getSpendingGoal({userId, goalId})
    expect(goal.data.id).to.equal(goalId)
    expectTypeOf<SpendingGoals.SpendingGoal>(goal.data)
  })

  it("can get all spending goals", async function() {
    const goals = await moneyhub.getSpendingGoals({}, userId)
    expect(goals.data.length).to.be.greaterThan(0)
    expectTypeOf<SpendingGoals.SpendingGoal[]>(goals.data)
  })

  it("can get all spending goals with limit", async function() {
    const goals = await moneyhub.getSpendingGoals({limit: 1}, userId)
    expect(goals.data.length).to.equal(1)
    expectTypeOf<SpendingGoals.SpendingGoal[]>(goals.data)
  })

  it("can update a spending goal", async function() {
    const goal = await moneyhub.updateSpendingGoal({goalId, userId, amount: {value: 329}})
    expect(goal.data.amount.value).to.equal(329)
    expectTypeOf<SpendingGoals.SpendingGoal>(goal.data)
  })

  it("can delete a spending goal", async function() {
    const result = await moneyhub.deleteSpendingGoal({userId, goalId})
    expect(result).to.equal(204)
  })
})
