/* eslint-disable max-nested-callbacks */
const Moneyhub = require("../")
const config = require("../../examples/config.local")
const {expect} = require("chai")

describe("API client", () => {
  describe("Client configuration", () => {
    let moneyhub
    before(async () => {
      if (config.mode !== "TEST") {
        throw new Error("These tests require example config to be set to test mode")
      }
      moneyhub = await Moneyhub(config)
    })

    it("should create client", () => {
      expect(moneyhub).to.be.an("object")
    })

    it("should export the required functions", () => {
      expect(Object.keys(moneyhub)).to.deep.equal([
        "getAccounts",
        "getAccountsWithDetails",
        "getAccount",
        "getAccountBalances",
        "getAccountWithDetails",
        "getAccountHoldings",
        "getAccountHoldingsWithMatches",
        "getAccountHolding",
        "getAccountCounterparties",
        "getAccountRecurringTransactions",
        "getAccountStandingOrders",
        "getAccountStandingOrdersWithDetail",
        "createAuthRequest",
        "completeAuthRequest",
        "getAllAuthRequests",
        "getAuthRequest",
        "addPayee",
        "getPayees",
        "getPayee",
        "getPayment",
        "getPayments",
        "getPaymentFromIDToken",
        "getProjects",
        "getProject",
        "addProject",
        "updateProject",
        "deleteProject",
        "syncUserConnection",
        "getTaxReturn",
        "getTransactions",
        "addFileToTransaction",
        "getTransactionFiles",
        "getTransactionFile",
        "deleteTransactionFile",
        "splitTransaction",
        "getTransactionSplits",
        "patchTransactionSplit",
        "deleteTransactionSplits",
        "getGlobalCounterparties",
        "listConnections",
        "listAPIConnections",
        "listTestConnections",
        "getOpenIdConfig",
        "registerUser",
        "getUsers",
        "getSCIMUsers",
        "getUser",
        "getUserConnections",
        "deleteUserConnection",
        "deleteUser",
        "getCategories",
        "getCategory",
        "getCategoryGroups",
        "createCustomCategory",
        "getAuthorizeUrl",
        "getAuthorizeUrlFromRequestUri",
        "requestObject",
        "getRequestUri",
        "getAuthorizeUrlForCreatedUser",
        "getReauthAuthorizeUrlForCreatedUser",
        "getRefreshAuthorizeUrlForCreatedUser",
        "getPaymentAuthorizeUrl",
        "exchangeCodeForTokensLegacy",
        "exchangeCodeForTokens",
        "refreshTokens",
        "getClientCredentialTokens",
        "keys",
      ])
    })

    describe("utility methods", () => {
      it("exports public keys", async () => {
        const keys = await moneyhub.keys()
        expect(keys.keys.length).to.eql(config.client.keys.length)
      })

      it("lists connections", async () => {
        const connections = await moneyhub.listConnections()
        expect(connections.length).to.be.greaterThan(100)
      })

      it("lists api connections", async () => {
        const connections = await moneyhub.listAPIConnections()
        expect(connections.length).to.be.greaterThan(10)
      })

      it("lists test connections", async () => {
        const connections = await moneyhub.listTestConnections()
        expect(connections.length).to.be.lessThan(10)
      })

      it("gets OpenID config", async () => {
        const openIdConfig = await moneyhub.getOpenIdConfig()
        expect(openIdConfig.issuer).to.be.a("string")
      })

      it("gets global counterparties", async () => {
        const counterparties = await moneyhub.getGlobalCounterparties()
        expect(counterparties.data.length).to.be.greaterThan(100)
      })
    })
  })
})
