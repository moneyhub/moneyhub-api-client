
import {expect} from "chai"
import {expectTypeOf} from "expect-type"

import {Moneyhub, MoneyhubInstance, NotificationThresholds} from "../"

describe("Notification Thresholds", function() {
  let moneyhub: MoneyhubInstance
  let userId: string
  let accountId: string
  let thresholdId: string

  before(async function() {
    moneyhub = await Moneyhub(this.config)

    userId = this.config.testUserId

    const account = await moneyhub.createAccount({userId, account: {
      accountName: "Account name",
      providerName: "Provider name",
      type: "cash:current",
      accountType: "personal",
      balance: {
        date: "2023-09-06",
        amount: {
          value: 90000,
          currency: "GBP",
        },
      },
    }})

    accountId = account.data.id
  })

  it("can create a notification threshold", async function() {
    const threshold = await moneyhub.addNotificationThreshold({
      userId,
      accountId,
      threshold: {type: "gt", value: 100000},
    })
    thresholdId = threshold.data.id
    expect(threshold.data.type).to.equal("gt")
    expect(threshold.data.value).to.equal(100000)
    expectTypeOf<NotificationThresholds.NotificationThreshold>(threshold.data)
  })

  it("can get notification thresholds", async function() {
    const thresholds = await moneyhub.getNotificationThresholds({userId, accountId})
    expect(thresholds.data.length).to.be.greaterThan(0)
    expectTypeOf<NotificationThresholds.NotificationThreshold[]>(thresholds.data)
  })

  it("can update a notification threshold", async function() {
    const threshold = await moneyhub.updateNotificationThreshold({userId, accountId, thresholdId, threshold: {type: "gt", value: 50000}})
    expect(threshold.data.value).to.equal(50000)
    expectTypeOf<NotificationThresholds.NotificationThreshold>(threshold.data)
  })

  it("can delete a notification threshold", async function() {
    const result = await moneyhub.deleteNotificationThreshold({userId, accountId, thresholdId})
    expect(result).to.equal(204)
  })
})
