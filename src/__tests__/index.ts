/* eslint-disable max-nested-callbacks */
import {expect} from "chai"

import {Moneyhub, MoneyhubInstance} from ".."

describe("API client", () => {
  describe("Client configuration", () => {
    let keys: any[],
      moneyhub: MoneyhubInstance

    before(async function() {
      keys = this.config.client.keys
      if (this.config.mode !== "TEST") {
        throw new Error("These tests require example config to be set to test mode")
      }
      moneyhub = await Moneyhub(this.config)
    })

    it("should create client", () => {
      expect(moneyhub).to.be.an("object")
    })

    it("should export the required functions", () => {
      expect(Object.keys(moneyhub).sort()).to.deep.equal([
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
        "getJWTBearerToken",
        "listConnections",
        "listAPIConnections",
        "listTestConnections",
        "listBetaConnections",
        "getOpenIdConfig",
        "registerUser",
        "getUsers",
        "getSCIMUsers",
        "getUser",
        "getUserConnections",
        "deleteUserConnection",
        "deleteUser",
        "getConnectionSyncs",
        "getSync",
        "updateUserConnection",
        "getCategories",
        "getStandardCategories",
        "getCategory",
        "getCategoryGroups",
        "getStandardCategoryGroups",
        "createCustomCategory",
        "createJWTBearerGrantToken",
        "getStandingOrder",
        "getStandingOrders",
        "getRegularTransactions",
        "detectRegularTransactions",
        "getRentalRecords",
        "createRentalRecord",
        "deleteRentalRecord",
        "getRecurringPayments",
        "getRecurringPayment",
        "makeRecurringPayment",
        "revokeRecurringPayment",
        "getSpendingAnalysis",
        "getSpendingGoals",
        "getSpendingGoal",
        "createSpendingGoal",
        "updateSpendingGoal",
        "deleteSpendingGoal",
        "getSavingsGoals",
        "getSavingsGoal",
        "createSavingsGoal",
        "updateSavingsGoal",
        "deleteSavingsGoal",
        "getAuthorizeUrl",
        "getAuthorizeUrlFromRequestUri",
        "requestObject",
        "getRequestUri",
        "getAuthorizeUrlForCreatedUser",
        "getPushedAuthorisationRequestUrl",
        "getReauthAuthorizeUrlForCreatedUser",
        "getReconsentAuthorizeUrlForCreatedUser",
        "getRefreshAuthorizeUrlForCreatedUser",
        "getPaymentAuthorizeUrl",
        "getReversePaymentAuthorizeUrl",
        "getRecurringPaymentAuthorizeUrl",
        "getStandingOrderAuthorizeUrl",
        "createAffordability",
        "getAffordability",
        "getAllAffordability",
        "exchangeCodeForTokensLegacy",
        "exchangeCodeForTokens",
        "refreshTokens",
        "getClientCredentialTokens",
        "keys",
        "generators",
      ].sort())
    })

    describe("utility methods", () => {
      it("exports public keys", async () => {
        const instanceKeys = await moneyhub.keys()
        expect(instanceKeys?.keys.length).to.eql(keys.length)
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
        expect((openIdConfig as any).issuer).to.be.a("string")
      })

      it("gets global counterparties", async () => {
        const counterparties = await moneyhub.getGlobalCounterparties()
        expect(counterparties.data.length).to.be.greaterThan(100)
      })
    })
  })
})
