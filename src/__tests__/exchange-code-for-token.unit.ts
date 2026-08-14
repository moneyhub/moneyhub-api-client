import {expect} from "chai"
import exchangeCodeForTokensFactory from "../exchange-code-for-token"

describe("exchangeCodeForTokensFactory (unit)", function() {
  const redirectUri = "https://app.example.com/callback"

  it("should reject when paramsFromCallback.state is missing but localParams.state is set", async function() {
    const client = {}
    const fn = exchangeCodeForTokensFactory({client: client as any, redirectUri})
    try {
      await fn({
        paramsFromCallback: {code: "c", session_state: "s"},
        localParams: {state: "st"},
      })
      expect.fail("should have thrown")
    } catch (e: any) {
      expect(e.message).to.equal("paramsFromCallback.state is missing")
    }
  })

  it("should reject when localParams.state is missing but params have state", async function() {
    const client = {}
    const fn = exchangeCodeForTokensFactory({client: client as any, redirectUri})
    try {
      await fn({
        paramsFromCallback: {state: "st", code: "c"},
        localParams: {} as any,
      })
      expect.fail("should have thrown")
    } catch (e: any) {
      expect(e.message).to.equal("localParams.state argument is missing")
    }
  })

  it("should reject when state mismatch", async function() {
    const client = {}
    const fn = exchangeCodeForTokensFactory({client: client as any, redirectUri})
    try {
      await fn({
        paramsFromCallback: {state: "st1", code: "c"},
        localParams: {state: "st2"},
      })
      expect.fail("should have thrown")
    } catch (e: any) {
      expect(e.message).to.equal("state mismatch")
    }
  })

  it("should reject when params contain error", async function() {
    const client = {}
    const fn = exchangeCodeForTokensFactory({client: client as any, redirectUri})
    try {
      await fn({
        paramsFromCallback: {state: "st", code: "c", error: "access_denied"},
        localParams: {state: "st"},
      })
      expect.fail("should have thrown")
    } catch (e: any) {
      expect(e.message).to.equal("access_denied")
    }
  })

  it("should reject when paramsFromCallback.code is missing", async function() {
    const client = {}
    const fn = exchangeCodeForTokensFactory({client: client as any, redirectUri})
    try {
      await fn({
        paramsFromCallback: {state: "st"},
        localParams: {state: "st"},
      })
      expect.fail("should have thrown")
    } catch (e: any) {
      expect(e.message).to.equal("paramsFromCallback.code is missing")
    }
  })

  it("should reject when response_type is 'none' but params have code", async function() {
    const client = {}
    const fn = exchangeCodeForTokensFactory({client: client as any, redirectUri})
    try {
      await fn({
        paramsFromCallback: {state: "st", code: "c"},
        localParams: {state: "st", response_type: "none"},
      })
      expect.fail("should have thrown")
    } catch (e: any) {
      expect(e.message).to.equal("unexpected params encountered for 'none' response")
    }
  })

  it("should reject when response_type requires code but code missing", async function() {
    const client = {}
    const fn = exchangeCodeForTokensFactory({client: client as any, redirectUri})
    try {
      await fn({
        paramsFromCallback: {state: "st"},
        localParams: {state: "st", response_type: "code"},
      })
      expect.fail("should have thrown")
    } catch (e: any) {
      expect(e.message).to.equal("paramsFromCallback.code is missing")
    }
  })

  it("should resolve with TokenSet when only code provided and grant succeeds", async function() {
    const tokenSet = {access_token: "at", refresh_token: "rt"}
    const client = {
      grant: () => Promise.resolve(tokenSet),
      decryptIdToken: (t: any) => Promise.resolve(t),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- mock callback, args not needed
      validateIdToken: (..._args: any[]) => Promise.resolve(tokenSet),
    }
    const fn = exchangeCodeForTokensFactory({client: client as any, redirectUri})
    const result = await fn({
      paramsFromCallback: {state: "st", code: "c"},
      localParams: {state: "st"},
    })
    expect(result).to.deep.equal(tokenSet)
  })

  it("should pass code_verifier and sub to grant", async function() {
    let grantOpts: any
    const client = {
      grant: (opts: any) => {
        grantOpts = opts
        return Promise.resolve({access_token: "at"})
      },
      decryptIdToken: (t: any) => Promise.resolve(t),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- mock callback, args not needed
      validateIdToken: (..._args: any[]) => Promise.resolve({}),
    }
    const fn = exchangeCodeForTokensFactory({client: client as any, redirectUri})
    await fn({
      paramsFromCallback: {state: "st", code: "c"},
      localParams: {state: "st", code_verifier: "cv", sub: "user-123"},
    })
    expect(grantOpts.code_verifier).to.equal("cv")
    expect(grantOpts.sub).to.equal("user-123")
  })

  it("should set session_state on tokenset when present in params", async function() {
    const client = {
      grant: () => Promise.resolve({access_token: "at"}),
      decryptIdToken: (t: any) => Promise.resolve(t),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- mock callback, args not needed
      validateIdToken: (..._args: any[]) => Promise.resolve({}),
    }
    const fn = exchangeCodeForTokensFactory({client: client as any, redirectUri})
    const result = await fn({
      paramsFromCallback: {state: "st", code: "c", session_state: "sess-123"},
      localParams: {state: "st"},
    })
    expect((result as any).session_state).to.equal("sess-123")
  })

  it("should reject when only id_token provided (no code) because code is required", async function() {
    const client = {
      decryptIdToken: (t: any) => Promise.resolve(t),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- mock callback, args not needed
      validateIdToken: (..._args: any[]) => Promise.resolve({}),
    }
    const fn = exchangeCodeForTokensFactory({client: client as any, redirectUri})
    try {
      await fn({
        paramsFromCallback: {state: "st", id_token: "id"},
        localParams: {state: "st"},
      })
      expect.fail("should have thrown")
    } catch (e: any) {
      expect(e.message).to.equal("paramsFromCallback.code is missing")
    }
  })

  it("should use client.default_max_age when localParams has no max_age", async function() {
    const client = {
      default_max_age: 300,
      grant: () => Promise.resolve({access_token: "at"}),
      decryptIdToken: (t: any) => Promise.resolve(t),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- mock callback, args not needed
      validateIdToken: (..._args: any[]) => Promise.resolve({}),
    }
    const fn = exchangeCodeForTokensFactory({client: client as any, redirectUri})
    let validateCalledWith: any
    ;(client as any).validateIdToken = (...args: any[]) => {
      validateCalledWith = args
      return Promise.resolve({})
    }
    await fn({
      paramsFromCallback: {state: "st", code: "c"},
      localParams: {state: "st"},
    })
    expect(validateCalledWith[3]).to.equal(300)
  })
})
