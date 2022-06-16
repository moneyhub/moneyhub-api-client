/* eslint-disable max-nested-callbacks */
const {Moneyhub} = require("..")
const {expect} = require("chai")

const state = "sample-state"
const nonce = "sample-nonce"
const code = "X3MNigTlftG~AKzSQfmVmfvVWrq"

describe.skip("Exchange Code For Token", () => {
  let config
  let moneyhub

  before(async () => {
    config = this.config
    moneyhub = await Moneyhub(config)
  })

  it("exchanges the code for a token", async () => {
    const tokens = await moneyhub.exchangeCodeForTokens({
      paramsFromCallback: {code, state},
      localParams: {state, nonce},
    })

    expect(tokens.access_token).to.be.a("string")
  })
})
