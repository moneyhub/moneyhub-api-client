/* eslint-disable max-nested-callbacks */
import {expect, assert} from "chai"
import {expectTypeOf} from "expect-type"

import {Moneyhub, MoneyhubInstance, RentalRecords} from ".."

const testRentalData: Omit<RentalRecords.RentalRecordPost, "seriesId"> = {
  title: "Title",
  firstName: "firstName",
  lastName: "lastName",
  birthdate: "2000-11-19",
  addressLine1: "First address line",
  addressLine2: "Second address line",
  addressLine3: "Third address line",
  addressLine4: "Fourth address line",
  postalCode: "CA12345",
  tenancyStartDate: "2020-11-19",
  rentalAmount: {
    value: 10000,
    currency: "GBP",
  },
  rentalFrequency: "monthly",
}

describe("Rental records", function() {
  let moneyhub: MoneyhubInstance
  let seriesId: string
  let rentalId: string
  let userId: string

  before(async function() {
    userId = this.config.testReadOnlyUserId
    moneyhub = await Moneyhub(this.config)
    const {data: regularTransactions} = await moneyhub.getRegularTransactions({userId})
    seriesId = regularTransactions[0].seriesId
    const {data: rentals} = await moneyhub.getRentalRecords({userId})
    if (rentals.length) {
      const existingRentalId = rentals[0].id
      await moneyhub.deleteRentalRecord({userId, rentalId: existingRentalId})
    }
  })

  beforeEach(async function() {
    const {data} = await moneyhub.createRentalRecord({rentalData: {...testRentalData, seriesId}, userId})
    rentalId = data.id
  })

  afterEach(async function() {
    try {
      await moneyhub.deleteRentalRecord({userId, rentalId})
    } catch (e) {
      if (!(e as any).message.includes("404")) {
        throw e
      }
    }

  })

  it("get rental record", async function() {
    const {data} = await moneyhub.getRentalRecords({userId})
    expect(data.length).to.be.above(0)
    expect(data[0]).to.have.property("seriesId")
    expectTypeOf<RentalRecords.RentalRecord[]>(data)
  })

  it("create rental record", async function() {
    const {data} = await moneyhub.getRentalRecords({userId})
    expect(data.length).to.be.above(0)
    assert.containsAllKeys(data[0], {
      title: "Title",
      firstName: "firstName",
      lastName: "lastName",
      birthdate: "2000-11-19",
      addressLine1: "First address line",
      addressLine2: "Second address line",
      addressLine3: "Third address line",
      addressLine4: "Fourth address line",
      postalCode: "CA12345",
      tenancyStartDate: "2020-11-19",
      rentalAmount: {
        value: 10000,
        currency: "GBP",
      },
      rentalFrequency: "monthly",
    })
    expectTypeOf<RentalRecords.RentalRecord[]>(data)
  })

  it("delete rental record", async function() {
    await moneyhub.deleteRentalRecord({userId, rentalId})
    const {data} = await moneyhub.getRentalRecords({userId})
    expect(data.length).to.eql(0)
  })

})
