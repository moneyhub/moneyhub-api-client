/* eslint-disable max-nested-callbacks */
const Moneyhub = require("../")
const config = require("../../test/test-client-config")
const {expect} = require("chai")

describe("Users", () => {
  let moneyhub
  let userId
  before(async () => {
    moneyhub = await Moneyhub(config)
  })

  it("can create a user", async () => {
    const user = await moneyhub.registerUser({clientUserId: "some-random-id"})
    userId = user.userId
    expect(user.userId).to.be.a("string")
    expect(user.clientUserId).to.equal("some-random-id")
  })

  it("can get a created user", async () => {
    const user = await moneyhub.getUser({userId})
    expect(user.userId).to.equal(userId)
  })

  it("can get all users", async () => {
    const users = await moneyhub.getUsers()
    expect(users.data.length).to.be.greaterThan(0)
  })

  it("can get all users with limit", async () => {
    const users = await moneyhub.getUsers({limit: 1})
    expect(users.data.length).to.equal(1)
  })

  it("can delete a user", async () => {
    const result = await moneyhub.deleteUser({userId})
    expect(result).to.equal(204)
  })
})
