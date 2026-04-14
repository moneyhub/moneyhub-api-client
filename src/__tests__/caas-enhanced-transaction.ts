/* eslint-disable max-nested-callbacks */
import {expect} from "chai"

import type {Request} from "../request"
import caasTransactions from "../requests/caas/enhanced-transactions"

describe("CAAS enhanced transaction request", function() {
  const caasResourceServerUrl = "https://api.test/caas/v1"

  it("calls the enhanced endpoint with scope and includeFieldTiers", async function() {
    let captured: {url: string, opts: Record<string, unknown>} | undefined
    const request = (async (url: string, opts?: Record<string, unknown>) => {
      captured = {url, opts: opts || {}}
      return {
        data: {
          transactionId: "tx-1",
          userId: "user-1",
          accountId: "acc-1",
        },
      }
    }) as Request

    const api = caasTransactions({
      config: {caasResourceServerUrl} as never,
      request,
    })

    const result = await api.caasGetEnhancedTransaction({
      accountId: "acc-1",
      transactionId: "tx-1",
      includeFieldTiers: "search_pro",
    })

    expect(captured?.url).to.equal(
      `${caasResourceServerUrl}/accounts/acc-1/transactions/tx-1/enhanced`,
    )
    expect(captured?.opts.cc).to.deep.equal({scope: "caas:enhanced_transactions:read"})
    expect(captured?.opts.searchParams).to.deep.equal({includeFieldTiers: "search_pro"})
    expect(result.data.transactionId).to.equal("tx-1")
  })

  it("omits searchParams when includeFieldTiers is not set", async function() {
    let captured: Record<string, unknown> | undefined
    const request = (async (_url: string, opts?: Record<string, unknown>) => {
      captured = opts || {}
      return {data: {transactionId: "t", userId: "u", accountId: "a"}}
    }) as Request

    const api = caasTransactions({
      config: {caasResourceServerUrl} as never,
      request,
    })

    await api.caasGetEnhancedTransaction({
      accountId: "a",
      transactionId: "t",
    })

    expect(captured?.searchParams).to.equal(undefined)
  })

  it("surfaces request failures", async function() {
    const request = (async () => {
      throw new Error("request failed")
    }) as Request

    const api = caasTransactions({
      config: {caasResourceServerUrl} as never,
      request,
    })

    let error: unknown
    try {
      await api.caasGetEnhancedTransaction({accountId: "a", transactionId: "t"})
    } catch (err) {
      error = err
    }
    expect(error).to.be.an("error")
    expect((error as Error).message).to.equal("request failed")
  })
})
