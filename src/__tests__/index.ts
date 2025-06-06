/* eslint-disable max-nested-callbacks */
import {expect} from "chai"

import {Moneyhub, MoneyhubInstance} from ".."

describe("API client", function() {
  describe("Client configuration", function() {
    let keys: any[],
      moneyhub: MoneyhubInstance

    before(async function() {
      keys = this.config.client.keys
      if (this.config.mode !== "TEST") {
        throw new Error("These tests require example config to be set to test mode")
      }
      moneyhub = await Moneyhub(this.config)
    })

    it("should create client", function() {
      expect(moneyhub).to.be.an("object")
    })

    it("should export the required functions", function() {
      expect(Object.keys(moneyhub).sort()).to.deep.equal([
        "getAccounts",
        "getAccountsWithDetails",
        "getAccount",
        "getAccountsList",
        "getAccountsListWithDetails",
        "getAccountBalances",
        "getAccountWithDetails",
        "getAccountHoldings",
        "getAccountHoldingsWithMatches",
        "getAccountHolding",
        "getAccountCounterparties",
        "getAccountRecurringTransactions",
        "getAccountStandingOrders",
        "getAccountStandingOrdersWithDetail",
        "getAccountStatements",
        "getAccountStatementsWithDetail",
        "getOsipAccounts",
        "getOsipAccount",
        "getOsipAccountHoldings",
        "getOsipAccountTransactions",
        "getPayLink",
        "getPayLinks",
        "createAccount",
        "addAccountBalance",
        "updateAccount",
        "deleteAccount",
        "createAuthRequest",
        "categoriseTransactions",
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
        "listPaymentsConnections",
        "getOpenIdConfig",
        "registerUser",
        "getUsers",
        "getSCIMUser",
        "registerSCIMUser",
        "getUser",
        "getUserConnections",
        "deleteUserConnection",
        "deleteUser",
        "getConnectionSyncs",
        "getUserSyncs",
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
        "getAuthorizeUrlLegacy",
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
        "createResellerCheckRequest",
        "getStandingOrderAuthorizeUrl",
        "createAffordability",
        "getAffordability",
        "getAllAffordability",
        "getNotificationThresholds",
        "addNotificationThreshold",
        "addPayLink",
        "updateNotificationThreshold",
        "deleteNotificationThreshold",
        "exchangeCodeForTokensLegacy",
        "exchangeCodeForTokens",
        "refreshTokens",
        "getClientCredentialTokens",
        "keys",
        "generators",
      ].sort())
    })

    describe("utility methods", function() {
      it("exports public keys", async function() {
        const instanceKeys = await moneyhub.keys()
        expect(instanceKeys?.keys.length).to.eql(keys.length)
      })

      it("lists connections", async function() {
        const connections = await moneyhub.listConnections()
        expect(connections.length).to.be.greaterThan(100)
      })

      it("lists api connections", async function() {
        const connections = await moneyhub.listAPIConnections()
        expect(connections.length).to.be.greaterThan(10)
      })

      it("lists test connections", async function() {
        const connections = await moneyhub.listTestConnections()
        expect(connections.length).to.be.lessThan(15)
      })

      it("gets OpenID config", async function() {
        const openIdConfig = await moneyhub.getOpenIdConfig()
        expect((openIdConfig as any).issuer).to.be.a("string")
      })

      it("gets global counterparties v2", async function() {
        const counterparties = await moneyhub.getGlobalCounterparties({}, {version: "v2"})
        expect(counterparties.data.length).to.be.greaterThan(100)
        expect(counterparties.data[0].id).to.match(/^global:/)
      })

      it.skip("gets global counterparties v3", async function() {
        const counterparties = await moneyhub.getGlobalCounterparties({limit: 100}, {version: "v3"})
        expect(counterparties.data.length).to.be.equal(100)
        expect(counterparties.data[0].id).to.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)
      })
    })
  })
})
