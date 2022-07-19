/* eslint-disable max-nested-callbacks */
import {expect} from "chai"
import {expectTypeOf} from "expect-type"

import {Moneyhub, MoneyhubInstance, AuthRequests} from ".."

describe("Auth requests", () => {
  let moneyhub: MoneyhubInstance,
    redirectUri: string,
    testPayeeId: string

  before(async function() {
    redirectUri = this.config.client.redirect_uri
    testPayeeId = this.config.testPayeeId
    moneyhub = await Moneyhub(this.config)
  })

  it("creates payment auth request", async () => {
    const {data} = await moneyhub.createAuthRequest({
      scope: "openid payment id:1ffe704d39629a929c8e293880fb449a",
      payment: {
        payeeId: testPayeeId,
        amount: 15,
        payerRef: "Payer ref",
        payeeRef: "Payee ref",
      },
      redirectUri,
    })

    expect(data).to.have.property("id")
    expect(data).to.have.property("status", "pending")
    expect(data).to.have.property("redirectParams")
    expect(data.redirectParams).to.have.property("authUrl")
    expect(data.redirectParams).to.have.property("returnUrl")
    expect(data.redirectParams).to.have.property("state")

    expectTypeOf<AuthRequests.AuthRequest>(data)
  })
})
