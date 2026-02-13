/* eslint-disable max-nested-callbacks */
import {expect} from "chai"
import {expectTypeOf} from "expect-type"
import type {TokenSet} from "openid-client"

import {Moneyhub, MoneyhubInstance} from ".."

const state = "sample-state"
const nonce = "sample-nonce"
const code = "X3MNigTlftG~AKzSQfmVmfvVWrq"

// Skipped: requires OAuth code exchange setup
describe.skip("Exchange Code For Token", function() { // eslint-disable-line mocha/no-skipped-tests
  let moneyhub: MoneyhubInstance

  before(async function() {
    moneyhub = await Moneyhub(this.config)
  })

  it("exchanges the code for a token", async function() {
    const tokens = await moneyhub.exchangeCodeForTokens({
      paramsFromCallback: {code, state},
      localParams: {state, nonce},
    })

    expect(tokens.access_token).to.be.a("string")
    expectTypeOf<TokenSet>(tokens)
  })
})
