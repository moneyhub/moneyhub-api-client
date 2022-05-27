/* eslint-disable max-nested-callbacks */
const {Moneyhub} = require("../")
const config = require("../../test/test-client-config")
const {expect} = require("chai")

describe("Savings Goals", () => {
  let moneyhub
  let userId
  let goalId
  let accountId

  before(async () => {
    moneyhub = await Moneyhub(config)
    const user = await moneyhub.registerUser({clientUserId: "some-random-id"})
    userId = user.userId
    const account = await moneyhub.createAccount({userId, account: {
      accountName: "Account name",
      providerName: "Provider name",
      type: "cash:current",
      accountType: "personal",
      balance: {
        date: "2018-08-12",
        amount: {
          value: 300023
        }
      }
    }})
    accountId = account.data.id
  })

  it("can create a savings goal", async () => {
    const goal = await moneyhub.createSavingsGoal({
      userId,
      name: "savings",
      amount: {value: 100},
      accounts: [{id: accountId}]
    })
    goalId = goal.data.id
    expect(goal.data.name).to.equal("savings")
    expect(goal.data.amount.value).to.equal(100)
  })

  it("can get a savings goal", async () => {
    const goal = await moneyhub.getSavingsGoal({userId, goalId})
    expect(goal.data.id).to.equal(goalId)
  })

  it("can get all savings goals", async () => {
    const goals = await moneyhub.getSavingsGoals({}, userId)
    expect(goals.data.length).to.be.greaterThan(0)
  })

  it("can get all savings goals with limit", async () => {
    const goals = await moneyhub.getSavingsGoals({limit: 1}, userId)
    expect(goals.data.length).to.equal(1)
  })

  it("can update a savings goal", async () => {
    const goal = await moneyhub.updateSavingsGoal({goalId, userId, amount: {value: 329}, name: "new-name"})
    expect(goal.data.amount.value).to.equal(329)
    expect(goal.data.name).to.equal("new-name")
  })

  it("can delete a savings goal", async () => {
    const result = await moneyhub.deleteSavingsGoal({userId, goalId})
    expect(result).to.equal(204)
  })
})
