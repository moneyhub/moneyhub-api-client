/* eslint-disable max-nested-callbacks */
const {Moneyhub} = require("../")
const {expect} = require("chai")

describe("Spending Goals", () => {
  let config
  let moneyhub
  let userId
  let goalId

  before(async function() {
    config = this.config
    moneyhub = await Moneyhub(config)
    userId = config.testUserId
  })

  it("can create a spending goal", async () => {
    const goal = await moneyhub.createSpendingGoal({
      userId,
      categoryId: "std:all",
      amount: {value: 100}
    })
    goalId = goal.data.id
    expect(goal.data.categoryId).to.equal("std:all")
    expect(goal.data.amount.value).to.equal(100)
  })

  it("can get a spending goal", async () => {
    const goal = await moneyhub.getSpendingGoal({userId, goalId})
    expect(goal.data.id).to.equal(goalId)
  })

  it("can get all spending goals", async () => {
    const goals = await moneyhub.getSpendingGoals({}, userId)
    expect(goals.data.length).to.be.greaterThan(0)
  })

  it("can get all spending goals with limit", async () => {
    const goals = await moneyhub.getSpendingGoals({limit: 1}, userId)
    expect(goals.data.length).to.equal(1)
  })

  it("can update a spending goal", async () => {
    const goal = await moneyhub.updateSpendingGoal({goalId, userId, amount: {value: 329}})
    expect(goal.data.amount.value).to.equal(329)
  })

  it("can delete a spending goal", async () => {
    const result = await moneyhub.deleteSpendingGoal({userId, goalId})
    expect(result).to.equal(204)
  })
})
