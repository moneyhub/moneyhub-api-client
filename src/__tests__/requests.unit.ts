import {expect} from "chai"
import accountsFactory from "../requests/accounts"
import transactionsFactory from "../requests/transactions"
import requestsFactory from "../requests"

describe("requests (unit)", function() {
  describe("requests/accounts (unit)", function() {
    const resourceServerUrl = "https://api.example.com"
    const config = {resourceServerUrl} as any

    it("getAccounts should call request with correct URL and cc scope", async function() {
      let capturedOpts: any, capturedUrl: string
      const request = ((url: string, opts?: any) => {
        capturedUrl = url
        capturedOpts = opts
        return Promise.resolve({data: []})
      }) as any
      const accounts = accountsFactory({config, request})
      await accounts.getAccounts({userId: "user-1", params: {limit: 10}})
      expect(capturedUrl!).to.equal(`${resourceServerUrl}/accounts`)
      expect(capturedOpts!.cc).to.deep.equal({scope: "accounts:read", sub: "user-1"})
      expect(capturedOpts!.searchParams).to.deep.equal({limit: 10})
    })

    it("getAccount should call request with accountId in path", async function() {
      let capturedUrl: string
      const request = ((url: string) => {
        capturedUrl = url
        return Promise.resolve({data: {}})
      }) as any
      const accounts = accountsFactory({config, request})
      await accounts.getAccount({userId: "user-1", accountId: "acc-123"})
      expect(capturedUrl!).to.equal(`${resourceServerUrl}/accounts/acc-123`)
    })
  })

  describe("requests/transactions (unit)", function() {
    const resourceServerUrl = "https://api.example.com"
    const config = {resourceServerUrl} as any

    it("getTransactions should call request with transactions URL", async function() {
      let capturedOpts: any, capturedUrl: string
      const request = ((url: string, opts?: any) => {
        capturedUrl = url
        capturedOpts = opts
        return Promise.resolve({data: []})
      }) as any
      const transactions = transactionsFactory({config, request})
      await transactions.getTransactions({userId: "user-1", params: {}})
      expect(capturedUrl!).to.equal(`${resourceServerUrl}/transactions`)
      expect(capturedOpts!.cc.scope).to.equal("transactions:read:all")
    })

    it("addTransaction should use POST and body", async function() {
      let capturedOpts: any
      const request = ((_url: string, opts?: any) => {
        capturedOpts = opts
        return Promise.resolve({data: {id: "tx-1"}})
      }) as any
      const transactions = transactionsFactory({config, request})
      const tx = {amount: 100, description: "Test"} as any
      await transactions.addTransaction({userId: "user-1", transaction: tx})
      expect(capturedOpts!.method).to.equal("POST")
      expect(capturedOpts!.body).to.deep.equal(tx)
    })
  })

  describe("requests factory (unit)", function() {
    it("should return an object with getAccounts, getTransactions, and other request methods", function() {
      const request = (() => Promise.resolve({})) as any
      const config = {resourceServerUrl: "https://api.example.com"} as any
      const api = requestsFactory({config, request})
      expect(api.getAccounts).to.be.a("function")
      expect(api.getTransactions).to.be.a("function")
      expect(api.getAuthRequest).to.be.a("function")
      expect(api.getPayees).to.be.a("function")
    })
  })
})
