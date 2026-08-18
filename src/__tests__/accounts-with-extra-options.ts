
import {expect} from "chai"

import {Accounts, Moneyhub, MoneyhubInstance} from ".."
import {expectTypeOf} from "expect-type"

describe("Accounts with extra options", function() {
  let moneyhub: MoneyhubInstance,
    userId: string

  before(async function() {
    const {
      testUserId,
    } = this.config
    userId = testUserId
    moneyhub = await Moneyhub(this.config)
  })

  it("errors with malformed token", async function() {
    let error: any
    try {
      await moneyhub.getAccounts({userId}, {
        token: "malformed.token",
      })
    } catch (err) {
      error = err
    }
    expect(error.response.statusCode).to.equal(401)
  })

  it("errors with malformed headers", async function() {
    let error: any
    try {
      await moneyhub.getAccounts({userId}, {
        headers: {
          Authorization: "malformed.header",
        },
      })
    } catch (err) {
      error = err
    }
    expect(error.response.statusCode).to.equal(401)
  })

  it("succeeds with given token", async function() {
    const {access_token: token} = await moneyhub.getClientCredentialTokens({scope: "accounts:read", sub: userId})

    const accounts = await moneyhub.getAccounts({userId}, {
      token,
    })
    expectTypeOf<Accounts.Account[]>(accounts.data)
  })

  it("succeeds with given headers", async function() {
    const {access_token: token} = await moneyhub.getClientCredentialTokens({scope: "accounts:read", sub: userId})

    const accounts = await moneyhub.getAccounts({userId}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    expectTypeOf<Accounts.Account[]>(accounts.data)
  })
})
