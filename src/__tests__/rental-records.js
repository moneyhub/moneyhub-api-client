/* eslint-disable max-nested-callbacks */
const Moneyhub = require("..")
const config = require("../../test/test-client-config")
const {expect, assert} = require("chai")

const testRentalData = {
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
    value: 10000
  },
  rentalFrequency: "monthly",
}

describe("Rental records", () => {
  let moneyhub
  let seriesId
  let rentalId
  const userId = config.testUserIdWithconnection

  before(async () => {
    moneyhub = await Moneyhub(config)
    const {data} = await moneyhub.getRegularTransactions({userId})
    seriesId = data[0].seriesId
  })

  beforeEach(async () => {
    const {data} = await moneyhub.createRentalRecord({rentalData: {...testRentalData, seriesId}, userId})
    rentalId = data.id
  })

  afterEach(async () => {
    try {
      await moneyhub.deleteRentalRecord({userId, rentalId})
    } catch (e) {
      if (!e.message.includes("404")) {
        throw e
      }
    }

  })

  it("get rental record", async () => {
    const {data} = await moneyhub.getRentalRecords({userId})
    expect(data.length).to.be.above(0)
    expect(data[0]).to.have.property("seriesId")
  })

  it("create rental record", async () => {
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
        currency: "GBP"
      },
      rentalFrequency: "monthly",
    })
  })

  it("delete rental record", async () => {
    await moneyhub.deleteRentalRecord({userId, rentalId})
    const {data} = await moneyhub.getRentalRecords({userId})
    expect(data.length).to.eql(0)
  })

})
