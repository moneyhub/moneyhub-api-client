
import {expect} from "chai"
import {expectTypeOf} from "expect-type"

import {Moneyhub, MoneyhubInstance, Users} from ".."

describe("Users", function() {
  let moneyhub: MoneyhubInstance
  let userId: string

  before(async function() {
    moneyhub = await Moneyhub(this.config)
  })

  it("can create a user", async function() {
    const user = await moneyhub.registerUser({clientUserId: "some-random-id"})
    userId = user.userId
    expect(user.userId).to.be.a("string")
    expect(user.clientUserId).to.equal("some-random-id")
    expectTypeOf<Users.User>(user)
  })

  it("can get a created user", async function() {
    const user = await moneyhub.getUser({userId})
    expect(user.userId).to.equal(userId)
    expectTypeOf<Users.User>(user)
  })

  it("can get all users", async function() {
    const users = await moneyhub.getUsers()
    expect(users.data.length).to.be.greaterThan(0)
    expectTypeOf<Users.User[]>(users.data)
  })

  it("can get all users with limit", async function() {
    const users = await moneyhub.getUsers({limit: 1})
    expect(users.data.length).to.equal(1)
    expectTypeOf<Users.User[]>(users.data)
  })

  it("can delete a user", async function() {
    const result = await moneyhub.deleteUser({userId})
    expect(result).to.equal(204)
  })
})
