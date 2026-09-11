/* eslint-disable max-nested-callbacks */
import {expect} from "chai"
import {expectTypeOf} from "expect-type"

import type {Request} from "../request"
import caasTransactions from "../requests/caas/transactions"
import type {CaasRecategorisationType} from "../requests/caas/types/transactions"

describe("CAAS patch transaction request", function() {
  const caasResourceServerUrl = "https://api.test/caas/v1"

  it("accepts single, future, and past-and-future as recategorisationType", function() {
    expectTypeOf<CaasRecategorisationType>().toEqualTypeOf<"single" | "future" | "past-and-future">()
  })

  const makeApi = (request: Request) =>
    caasTransactions({
      config: {caasResourceServerUrl} as never,
      request,
    })

  it("calls PATCH with write scope and userCategoryId body", async function() {
    let captured: {url: string, opts: Record<string, unknown>} | undefined
    const request = (async (url: string, opts?: Record<string, unknown>) => {
      captured = {url, opts: opts || {}}
      return {data: {transactionId: "tx-1"}}
    }) as Request

    const result = await makeApi(request).caasPatchTransaction({
      accountId: "acc-1",
      transactionId: "tx-1",
      userCategoryId: "cat-1",
      recategorisationType: "single",
    })

    expect(captured?.url).to.equal(
      `${caasResourceServerUrl}/accounts/acc-1/transactions/tx-1`,
    )
    expect(captured?.opts.method).to.equal("PATCH")
    expect(captured?.opts.cc).to.deep.equal({scope: "caas:transactions:write"})
    expect(captured?.opts.body).to.deep.equal({userCategoryId: "cat-1"})
    expect(captured?.opts.searchParams).to.deep.equal({recategorisationType: "single"})
    expect(result.data.transactionId).to.equal("tx-1")
  })

  it("defaults recategorisationType to single when it is not provided", async function() {
    let captured: Record<string, unknown> | undefined
    const request = (async (_url: string, opts?: Record<string, unknown>) => {
      captured = opts || {}
      return {data: {}}
    }) as Request

    await makeApi(request).caasPatchTransaction({
      accountId: "acc-1",
      transactionId: "tx-1",
      userCategoryId: "cat-1",
    })

    expect(captured?.searchParams).to.deep.equal({recategorisationType: "single"})
  })

  it("passes recategorisationType=past-and-future", async function() {
    let captured: Record<string, unknown> | undefined
    const request = (async (_url: string, opts?: Record<string, unknown>) => {
      captured = opts || {}
      return {data: {}}
    }) as Request

    await makeApi(request).caasPatchTransaction({
      accountId: "acc-1",
      transactionId: "tx-1",
      userCategoryId: "cat-1",
      recategorisationType: "past-and-future",
    })

    expect(captured?.searchParams).to.deep.equal({recategorisationType: "past-and-future"})
  })

  it("passes recategorisationType=future", async function() {
    let captured: Record<string, unknown> | undefined
    const request = (async (_url: string, opts?: Record<string, unknown>) => {
      captured = opts || {}
      return {data: {}}
    }) as Request

    await makeApi(request).caasPatchTransaction({
      accountId: "acc-1",
      transactionId: "tx-1",
      userCategoryId: "cat-1",
      recategorisationType: "future",
    })

    expect(captured?.searchParams).to.deep.equal({recategorisationType: "future"})
  })

  it("surfaces request failures", async function() {
    const request = (async () => {
      throw new Error("request failed")
    }) as Request

    let error: unknown
    try {
      await makeApi(request).caasPatchTransaction({
        accountId: "a",
        transactionId: "t",
        userCategoryId: "c",
      })
    } catch (err) {
      error = err
    }
    expect(error).to.be.an("error")
    expect((error as Error).message).to.equal("request failed")
  })
})
