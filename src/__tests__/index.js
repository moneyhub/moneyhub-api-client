/* eslint-disable max-nested-callbacks */
const Moneyhub = require("../")
const config = require("../../test/test-client-config")
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
        "createAccount",
        "deleteAccount",
        "createAuthRequest",
        "completeAuthRequest",
        "getAllAuthRequests",
        "getAuthRequest",
        "getBeneficiary",
        "getBeneficiaryWithDetail",
        "getBeneficiaries",
        "getBeneficiariesWithDetail",
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
        "getTransaction",
        "addTransaction",
        "addTransactions",
        "updateTransaction",
        "deleteTransaction",
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
        "getStandardCategories",
        "getCategory",
        "getCategoryGroups",
        "getStandardCategoryGroups",
        "createCustomCategory",
        "getStandingOrder",
        "getStandingOrders",
        "getRegularTransactions",
        "getRentalRecords",
        "createRentalRecord",
        "deleteRentalRecord",
        "getAuthorizeUrl",
        "getAuthorizeUrlFromRequestUri",
        "requestObject",
        "getRequestUri",
        "getAuthorizeUrlForCreatedUser",
        "getReauthAuthorizeUrlForCreatedUser",
        "getRefreshAuthorizeUrlForCreatedUser",
        "getPaymentAuthorizeUrl",
        "getReversePaymentAuthorizeUrl",
        "getStandingOrderAuthorizeUrl",
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
