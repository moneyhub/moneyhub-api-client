/* eslint-disable max-nested-callbacks */
import {expect} from "chai"
import {expectTypeOf} from "expect-type"

import {Moneyhub, MoneyhubInstance, SavingsGoals} from "../"

describe("Savings Goals", function() {
  let moneyhub: MoneyhubInstance
  let userId: string
  let goalId: string
  let accountId: string

  before(async function() {
    moneyhub = await Moneyhub(this.config)
    userId = this.config.testUserId
    const account = await moneyhub.createAccount({userId, account: {
      accountName: "Account name",
      providerName: "Provider name",
      type: "cash:current",
      accountType: "personal",
      balance: {
        date: "2018-08-12",
        amount: {
          value: 300023,
          currency: "GBP",
        },
      },
    }})
    accountId = account.data.id
  })

  it("can create a savings goal", async function() {
    const goal = await moneyhub.createSavingsGoal({
      userId,
      name: "savings",
      amount: {value: 100},
      accounts: [{id: accountId}],
    })
    goalId = goal.data.id
    expect(goal.data.name).to.equal("savings")
    expect(goal.data.amount.value).to.equal(100)
    expectTypeOf<SavingsGoals.SavingsGoal>(goal.data)
  })

  it("can get a savings goal", async function() {
    const goal = await moneyhub.getSavingsGoal({userId, goalId})
    expect(goal.data.id).to.equal(goalId)
    expectTypeOf<SavingsGoals.SavingsGoal>(goal.data)
  })

  it("can get all savings goals", async function() {
    const goals = await moneyhub.getSavingsGoals({}, userId)
    expect(goals.data.length).to.be.greaterThan(0)
    expectTypeOf<SavingsGoals.SavingsGoal[]>(goals.data)
  })

  it("can get all savings goals with limit", async function() {
    const goals = await moneyhub.getSavingsGoals({limit: 1}, userId)
    expect(goals.data.length).to.equal(1)
    expectTypeOf<SavingsGoals.SavingsGoal[]>(goals.data)
  })

  it("can update a savings goal", async function() {
    const goal = await moneyhub.updateSavingsGoal({
      goalId,
      userId,
      amount: {value: 329},
      accounts: [{id: accountId}],
      name: "new-name",
    })
    expect(goal.data.amount.value).to.equal(329)
    expect(goal.data.name).to.equal("new-name")
    expectTypeOf<SavingsGoals.SavingsGoal>(goal.data)
  })

  it("can delete a savings goal", async function() {
    const result = await moneyhub.deleteSavingsGoal({userId, goalId})
    expect(result).to.equal(204)
  })
})
