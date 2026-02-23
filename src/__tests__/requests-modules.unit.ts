import {expect} from "chai"

import accountsFactory from "../requests/accounts"
import beneficiariesFactory from "../requests/beneficiaries"
import consentHistoryFactory from "../requests/consent-history"
import unauthenticatedFactory from "../requests/unauthenticated"
import usersAndConnectionsFactory from "../requests/users-and-connections"
import standardFinancialStatementsFactory from "../requests/standard-financial-statements"
import resellerCheckFactory from "../requests/reseller-check"
import standingOrdersFactory from "../requests/standing-orders"
import recurringPaymentsFactory from "../requests/recurring-payments"
import spendingAnalysisFactory from "../requests/spending-analysis"
import syncFactory from "../requests/sync"
import taxFactory from "../requests/tax"
import categoriesFactory from "../requests/categories"
import payLinksFactory from "../requests/pay-links"
import payeesFactory from "../requests/payees"
import notificationThresholdsFactory from "../requests/notification-thresholds"
import savingsGoalsFactory from "../requests/savings-goals"
import spendingGoalsFactory from "../requests/spending-goals"
import projectsFactory from "../requests/projects"
import rentalRecordsFactory from "../requests/rental-records"
import regularTransactionsFactory from "../requests/regular-transactions"
import transactionFilesFactory from "../requests/transaction-files"
import transactionSplitsFactory from "../requests/transaction-splits"
import affordabilityFactory from "../requests/affordability"
import authRequestsFactory from "../requests/auth-requests"
import paymentsFactory from "../requests/payments"
import caasAccountsFactory from "../requests/caas/accounts"
import caasCategoriesFactory from "../requests/caas/categories"
import caasUsersFactory from "../requests/caas/users"
import caasTransactionsFactory from "../requests/caas/transactions"
import osipFactory from "../requests/osip"

const createMockRequest = (capture: {url?: string; opts?: any}) =>
  ((url: string, opts?: any) => {
    capture.url = url
    capture.opts = opts
    return Promise.resolve({data: []})
  }) as any

describe("requests modules (unit)", function() {
  describe("request modules (part 1a)", function() {
    describe("requests/accounts (unit)", function() {
      const resourceServerUrl = "https://api.example.com"
      const config = {resourceServerUrl} as any

      it("getAccountsWithDetails calls request with accounts_details:read scope", async function() {
        const capture: any = {}
        const api = accountsFactory({config, request: createMockRequest(capture)})
        await api.getAccountsWithDetails({userId: "u1"})
        expect(capture.url).to.equal(`${resourceServerUrl}/accounts`)
        expect(capture.opts.cc.scope).to.equal("accounts:read accounts_details:read")
      })

      it("getAccountsList calls accounts-list URL", async function() {
        const capture: any = {}
        const api = accountsFactory({config, request: createMockRequest(capture)})
        await api.getAccountsList({userId: "u1"})
        expect(capture.url).to.equal(`${resourceServerUrl}/accounts-list`)
      })

      it("getAccountBalances calls account balances path", async function() {
        const capture: any = {}
        const api = accountsFactory({config, request: createMockRequest(capture)})
        await api.getAccountBalances({userId: "u1", accountId: "acc1"})
        expect(capture.url).to.equal(`${resourceServerUrl}/accounts/acc1/balances`)
      })

      it("getAccountWithDetails uses accounts_details:read scope", async function() {
        const capture: any = {}
        const api = accountsFactory({config, request: createMockRequest(capture)})
        await api.getAccountWithDetails({userId: "u1", accountId: "acc1"})
        expect(capture.url).to.equal(`${resourceServerUrl}/accounts/acc1`)
        expect(capture.opts.cc.scope).to.equal("accounts:read accounts_details:read")
      })

      it("getAccountHoldings calls holdings path", async function() {
        const capture: any = {}
        const api = accountsFactory({config, request: createMockRequest(capture)})
        await api.getAccountHoldings({userId: "u1", accountId: "acc1"})
        expect(capture.url).to.equal(`${resourceServerUrl}/accounts/acc1/holdings`)
      })

      it("getAccountHoldingsWithMatches calls holdings-with-matches path", async function() {
        const capture: any = {}
        const api = accountsFactory({config, request: createMockRequest(capture)})
        await api.getAccountHoldingsWithMatches({userId: "u1", accountId: "acc1"})
        expect(capture.url).to.include("/holdings-with-matches")
      })

      it("getAccountHolding calls with holdingId in path", async function() {
        const capture: any = {}
        const api = accountsFactory({config, request: createMockRequest(capture)})
        await api.getAccountHolding({userId: "u1", accountId: "acc1", holdingId: "h1"})
        expect(capture.url).to.equal(`${resourceServerUrl}/accounts/acc1/holdings/h1`)
      })

      it("getAccountStatements calls statements path", async function() {
        const capture: any = {}
        const api = accountsFactory({config, request: createMockRequest(capture)})
        await api.getAccountStatements({userId: "u1", accountId: "acc1"})
        expect(capture.url).to.equal(`${resourceServerUrl}/accounts/acc1/statements`)
        expect(capture.opts.cc.scope).to.include("statements_basic:read")
      })

      it("createAccount uses POST and body", async function() {
        const capture: any = {}
        const api = accountsFactory({config, request: createMockRequest(capture)})
        await api.createAccount({userId: "u1", account: {accountName: "Test"} as any})
        expect(capture.url).to.equal(`${resourceServerUrl}/accounts`)
        expect(capture.opts.method).to.equal("POST")
        expect(capture.opts.body).to.eql({accountName: "Test"})
      })

      it("deleteAccount uses DELETE and returnStatus", async function() {
        const capture: any = {}
        const api = accountsFactory({config, request: createMockRequest(capture)})
        await api.deleteAccount({userId: "u1", accountId: "acc1"})
        expect(capture.url).to.equal(`${resourceServerUrl}/accounts/acc1`)
        expect(capture.opts.method).to.equal("DELETE")
        expect(capture.opts.returnStatus).to.equal(true)
      })

      it("addAccountBalance uses POST and body", async function() {
        const capture: any = {}
        const api = accountsFactory({config, request: createMockRequest(capture)})
        await api.addAccountBalance({userId: "u1", accountId: "acc1", balance: {amount: 100} as any})
        expect(capture.url).to.equal(`${resourceServerUrl}/accounts/acc1/balances`)
        expect(capture.opts.method).to.equal("POST")
      })

      it("updateAccount uses PATCH and body", async function() {
        const capture: any = {}
        const api = accountsFactory({config, request: createMockRequest(capture)})
        await api.updateAccount({userId: "u1", accountId: "acc1", account: {accountName: "Updated"} as any})
        expect(capture.url).to.equal(`${resourceServerUrl}/accounts/acc1`)
        expect(capture.opts.method).to.equal("PATCH")
      })
    })

    describe("requests/beneficiaries (unit)", function() {
      const resourceServerUrl = "https://api.example.com"
      const config = {resourceServerUrl} as any

      it("getBeneficiaries calls request with correct URL and scope", async function() {
        const capture: any = {}
        const api = beneficiariesFactory({config, request: createMockRequest(capture)})
        await api.getBeneficiaries({userId: "u1", params: {limit: 5}})
        expect(capture.url).to.equal(`${resourceServerUrl}/beneficiaries`)
        expect(capture.opts.cc.scope).to.equal("beneficiaries:read")
      })

      it("getBeneficiary calls request with id in path", async function() {
        const capture: any = {}
        const api = beneficiariesFactory({config, request: createMockRequest(capture)})
        await api.getBeneficiary({id: "b1", userId: "u1"})
        expect(capture.url).to.equal(`${resourceServerUrl}/beneficiaries/b1`)
      })
    })

    describe("requests/unauthenticated (unit)", function() {
      const resourceServerUrl = "https://api.example.com"
      const identityServiceUrl = "https://identity.example.com"
      const config = {resourceServerUrl, identityServiceUrl} as any

      it("getGlobalCounterparties calls resource server URL", async function() {
        const capture: any = {}
        const api = unauthenticatedFactory({config, request: createMockRequest(capture)})
        await api.getGlobalCounterparties({})
        expect(capture.url).to.equal(`${resourceServerUrl}/global-counterparties`)
      })

      it("listLegacyConnections calls identity legacy-connections", async function() {
        const capture: any = {}
        const api = unauthenticatedFactory({config, request: createMockRequest(capture)})
        await api.listLegacyConnections()
        expect(capture.url).to.include("/oidc/.well-known/legacy-connections")
      })
    })

    describe("requests/users-and-connections (unit)", function() {
      const identityServiceUrl = "https://identity.example.com"
      const config = {identityServiceUrl} as any

      it("registerUser uses POST and users URL", async function() {
        const capture: any = {}
        const api = usersAndConnectionsFactory({config, request: createMockRequest(capture)})
        await api.registerUser({clientUserId: "c1"})
        expect(capture.url).to.equal(`${identityServiceUrl}/users`)
        expect(capture.opts.method).to.equal("POST")
        expect(capture.opts.cc.scope).to.equal("user:create")
      })

      it("getUsers calls users URL with scope", async function() {
        const capture: any = {}
        const api = usersAndConnectionsFactory({config, request: createMockRequest(capture)})
        await api.getUsers()
        expect(capture.url).to.equal(`${identityServiceUrl}/users`)
        expect(capture.opts.cc.scope).to.equal("user:read")
      })

      it("getUser calls with userId in path", async function() {
        const capture: any = {}
        const api = usersAndConnectionsFactory({config, request: createMockRequest(capture)})
        await api.getUser({userId: "u1"})
        expect(capture.url).to.equal(`${identityServiceUrl}/users/u1`)
      })

      it("getUserConnections calls user connections path", async function() {
        const capture: any = {}
        const api = usersAndConnectionsFactory({config, request: createMockRequest(capture)})
        await api.getUserConnections({userId: "u1"})
        expect(capture.url).to.equal(`${identityServiceUrl}/users/u1/connections`)
      })

      it("deleteUserConnection uses DELETE", async function() {
        const capture: any = {}
        const api = usersAndConnectionsFactory({config, request: createMockRequest(capture)})
        await api.deleteUserConnection({userId: "u1", connectionId: "conn1"})
        expect(capture.url).to.include("/users/u1/connection/conn1")
        expect(capture.opts.method).to.equal("DELETE")
      })

      it("deleteUser uses DELETE", async function() {
        const capture: any = {}
        const api = usersAndConnectionsFactory({config, request: createMockRequest(capture)})
        await api.deleteUser({userId: "u1"})
        expect(capture.url).to.equal(`${identityServiceUrl}/users/u1`)
        expect(capture.opts.method).to.equal("DELETE")
      })

      it("getConnectionSyncs calls syncs path", async function() {
        const capture: any = {}
        const api = usersAndConnectionsFactory({config, request: createMockRequest(capture)})
        await api.getConnectionSyncs({userId: "u1", connectionId: "conn1"})
        expect(capture.url).to.include("/users/u1/connections/conn1/syncs")
      })

      it("getUserSyncs calls user syncs path", async function() {
        const capture: any = {}
        const api = usersAndConnectionsFactory({config, request: createMockRequest(capture)})
        await api.getUserSyncs({userId: "u1"})
        expect(capture.url).to.equal(`${identityServiceUrl}/users/u1/syncs`)
      })

      it("getSync calls with syncId in path", async function() {
        const capture: any = {}
        const api = usersAndConnectionsFactory({config, request: createMockRequest(capture)})
        await api.getSync({userId: "u1", syncId: "sync1"})
        expect(capture.url).to.equal(`${identityServiceUrl}/users/u1/syncs/sync1`)
      })

      it("updateUserConnection uses PATCH and body", async function() {
        const capture: any = {}
        const api = usersAndConnectionsFactory({config, request: createMockRequest(capture)})
        await api.updateUserConnection({userId: "u1", connectionId: "conn1", expiresAt: "2025-12-31"})
        expect(capture.url).to.include("/users/u1/connections/conn1")
        expect(capture.opts.method).to.equal("PATCH")
        expect(capture.opts.body).to.eql({expiresAt: "2025-12-31"})
      })

      it("registerSCIMUser uses POST and scim/users URL", async function() {
        const capture: any = {}
        const api = usersAndConnectionsFactory({config, request: createMockRequest(capture)})
        await api.registerSCIMUser({externalId: "e1", name: {familyName: "Test", givenName: "User"}, emails: []})
        expect(capture.url).to.equal(`${identityServiceUrl}/scim/users`)
        expect(capture.opts.method).to.equal("POST")
        expect(capture.opts.cc.scope).to.equal("scim_user:write")
      })

      it("getSCIMUser calls with userId in path", async function() {
        const capture: any = {}
        const api = usersAndConnectionsFactory({config, request: createMockRequest(capture)})
        await api.getSCIMUser({userId: "u1"})
        expect(capture.url).to.equal(`${identityServiceUrl}/scim/users/u1`)
      })
    })

    describe("requests/standard-financial-statements (unit)", function() {
      const resourceServerUrl = "https://api.example.com"
      const config = {resourceServerUrl} as any

      it("getStandardFinancialStatements calls correct URL and scope", async function() {
        const capture: any = {}
        const api = standardFinancialStatementsFactory({config, request: createMockRequest(capture)})
        await api.getStandardFinancialStatements({userId: "u1"})
        expect(capture.url).to.equal(`${resourceServerUrl}/standard-financial-statements`)
        expect(capture.opts.cc.scope).to.equal("standard_financial_statement:read")
      })

      it("getStandardFinancialStatement calls reportId path", async function() {
        const capture: any = {}
        const api = standardFinancialStatementsFactory({config, request: createMockRequest(capture)})
        await api.getStandardFinancialStatement({userId: "u1", reportId: "r1"})
        expect(capture.url).to.equal(`${resourceServerUrl}/standard-financial-statements/r1`)
      })
    })

    describe("requests/consent-history (unit)", function() {
      const identityServiceUrl = "https://identity.example.com"
      const config = {identityServiceUrl} as any

      it("getConsentHistory calls identity URL", async function() {
        const capture: any = {}
        const api = consentHistoryFactory({config, request: createMockRequest(capture)})
        await api.getConsentHistory({userId: "u1"})
        expect(capture.url).to.equal(`${identityServiceUrl}/consent-history`)
        expect(capture.opts.cc.scope).to.equal("consent_history:read")
      })
    })

    describe("requests/reseller-check (unit)", function() {
      const identityServiceUrl = "https://identity.example.com"
      const config = {identityServiceUrl} as any

      it("createResellerCheckRequest uses POST and body", async function() {
        const capture: any = {}
        const api = resellerCheckFactory({config, request: createMockRequest(capture)})
        await api.createResellerCheckRequest({companyRegistrationNumber: "123", email: "a@b.com", telephone: "07770000000"})
        expect(capture.url).to.equal(`${identityServiceUrl}/reseller-check`)
        expect(capture.opts.method).to.equal("POST")
      })
    })

    describe("requests/standing-orders (unit)", function() {
      const identityServiceUrl = "https://identity.example.com"
      const config = {identityServiceUrl} as any

      it("getStandingOrders calls identity URL", async function() {
        const capture: any = {}
        const api = standingOrdersFactory({config, request: createMockRequest(capture)})
        await api.getStandingOrders()
        expect(capture.url).to.equal(`${identityServiceUrl}/standing-orders`)
      })

      it("getStandingOrder calls with id in path", async function() {
        const capture: any = {}
        const api = standingOrdersFactory({config, request: createMockRequest(capture)})
        await api.getStandingOrder({id: "so1"})
        expect(capture.url).to.equal(`${identityServiceUrl}/standing-orders/so1`)
      })
    })
  })

  describe("request modules (part 1b)", function() {
    describe("requests/recurring-payments (unit)", function() {
      const identityServiceUrl = "https://identity.example.com"
      const config = {identityServiceUrl} as any

      it("getRecurringPayments calls identity URL", async function() {
        const capture: any = {}
        const api = recurringPaymentsFactory({config, request: createMockRequest(capture)})
        await api.getRecurringPayments({})
        expect(capture.url).to.equal(`${identityServiceUrl}/recurring-payments`)
      })

      it("makeRecurringPayment uses POST and pay path", async function() {
        const capture: any = {}
        const api = recurringPaymentsFactory({config, request: createMockRequest(capture)})
        await api.makeRecurringPayment({recurringPaymentId: "rp1", payment: {} as any})
        expect(capture.url).to.include("/recurring-payments/rp1/pay")
        expect(capture.opts.method).to.equal("POST")
      })
    })

    describe("requests/spending-analysis (unit)", function() {
      const resourceServerUrl = "https://api.example.com"
      const config = {resourceServerUrl} as any

      it("getSpendingAnalysis uses POST and correct URL", async function() {
        const capture: any = {}
        const api = spendingAnalysisFactory({config, request: createMockRequest(capture)})
        await api.getSpendingAnalysis({userId: "u1", dates: [{name: "2020", from: "2020-01-01", to: "2020-12-31"}]})
        expect(capture.url).to.equal(`${resourceServerUrl}/spending-analysis`)
        expect(capture.opts.method).to.equal("POST")
      })
    })

    describe("requests/sync (unit)", function() {
      const resourceServerUrl = "https://api.example.com"
      const config = {resourceServerUrl} as any

      it("syncUserConnection calls sync path with connectionId", async function() {
        const capture: any = {}
        const api = syncFactory({config, request: createMockRequest(capture)})
        await api.syncUserConnection({userId: "u1", connectionId: "conn1"})
        expect(capture.url).to.equal(`${resourceServerUrl}/sync/conn1`)
        expect(capture.opts.method).to.equal("POST")
      })
    })

    describe("requests/tax (unit)", function() {
      const resourceServerUrl = "https://api.example.com"
      const config = {resourceServerUrl} as any

      it("getTaxReturn calls tax URL with scope", async function() {
        const capture: any = {}
        const api = taxFactory({config, request: createMockRequest(capture)})
        await api.getTaxReturn({userId: "u1", params: {startDate: "2020-01-01", endDate: "2020-12-31"}})
        expect(capture.url).to.equal(`${resourceServerUrl}/tax`)
        expect(capture.opts.cc.scope).to.equal("tax:read")
      })
    })

    describe("requests/categories (unit)", function() {
      const resourceServerUrl = "https://api.example.com"
      const config = {resourceServerUrl} as any

      it("getCategories calls categories URL", async function() {
        const capture: any = {}
        const api = categoriesFactory({config, request: createMockRequest(capture)})
        await api.getCategories({userId: "u1"})
        expect(capture.url).to.equal(`${resourceServerUrl}/categories`)
      })

      it("getCategoryGroups calls category-groups URL", async function() {
        const capture: any = {}
        const api = categoriesFactory({config, request: createMockRequest(capture)})
        await api.getCategoryGroups({userId: "u1"})
        expect(capture.url).to.equal(`${resourceServerUrl}/category-groups`)
      })
    })

    describe("requests/pay-links (unit)", function() {
      const identityServiceUrl = "https://identity.example.com"
      const config = {identityServiceUrl} as any

      it("addPayLink uses POST", async function() {
        const capture: any = {}
        const api = payLinksFactory({config, request: createMockRequest(capture)})
        await api.addPayLink({payeeId: "p1", widgetId: "w1", reference: "ref", amount: 100} as any)
        expect(capture.url).to.equal(`${identityServiceUrl}/pay-links`)
        expect(capture.opts.method).to.equal("POST")
      })

      it("getPayLink calls with id in path", async function() {
        const capture: any = {}
        const api = payLinksFactory({config, request: createMockRequest(capture)})
        await api.getPayLink({id: "pl1"})
        expect(capture.url).to.equal(`${identityServiceUrl}/pay-links/pl1`)
      })
    })

    describe("requests/payees (unit)", function() {
      const identityServiceUrl = "https://identity.example.com"
      const config = {identityServiceUrl} as any

      it("getPayees calls identity payees URL", async function() {
        const capture: any = {}
        const api = payeesFactory({config, request: createMockRequest(capture)})
        await api.getPayees()
        expect(capture.url).to.equal(`${identityServiceUrl}/payees`)
      })
    })

    describe("requests/notification-thresholds (unit)", function() {
      const resourceServerUrl = "https://api.example.com"
      const config = {resourceServerUrl} as any

      it("getNotificationThresholds calls account-scoped URL", async function() {
        const capture: any = {}
        const api = notificationThresholdsFactory({config, request: createMockRequest(capture)})
        await api.getNotificationThresholds({userId: "u1", accountId: "acc1"})
        expect(capture.url).to.equal(`${resourceServerUrl}/accounts/acc1/notification-thresholds`)
      })
    })
  })

  describe("request modules (part 2)", function() {
    describe("requests/savings-goals (unit)", function() {
      const resourceServerUrl = "https://api.example.com"
      const config = {resourceServerUrl} as any

      it("getSavingsGoals calls correct URL", async function() {
        const capture: any = {}
        const api = savingsGoalsFactory({config, request: createMockRequest(capture)})
        await api.getSavingsGoals({}, "u1")
        expect(capture.url).to.include("/savings-goals")
      })
    })

    describe("requests/spending-goals (unit)", function() {
      const resourceServerUrl = "https://api.example.com"
      const config = {resourceServerUrl} as any

      it("getSpendingGoals calls correct URL", async function() {
        const capture: any = {}
        const api = spendingGoalsFactory({config, request: createMockRequest(capture)})
        await api.getSpendingGoals({}, "u1")
        expect(capture.url).to.include("/spending-goals")
      })
    })

    describe("requests/projects (unit)", function() {
      const resourceServerUrl = "https://api.example.com"
      const config = {resourceServerUrl} as any

      it("getProjects calls projects URL", async function() {
        const capture: any = {}
        const api = projectsFactory({config, request: createMockRequest(capture)})
        await api.getProjects({userId: "u1"})
        expect(capture.url).to.equal(`${resourceServerUrl}/projects`)
      })
    })

    describe("requests/rental-records (unit)", function() {
      const resourceServerUrl = "https://api.example.com"
      const config = {resourceServerUrl} as any

      it("getRentalRecords calls rental-records URL", async function() {
        const capture: any = {}
        const api = rentalRecordsFactory({config, request: createMockRequest(capture)})
        await api.getRentalRecords({userId: "u1"})
        expect(capture.url).to.include("/rental-records")
      })
    })

    describe("requests/regular-transactions (unit)", function() {
      const resourceServerUrl = "https://api.example.com"
      const config = {resourceServerUrl} as any

      it("getRegularTransactions calls correct URL", async function() {
        const capture: any = {}
        const api = regularTransactionsFactory({config, request: createMockRequest(capture)})
        await api.getRegularTransactions({userId: "u1", params: {}})
        expect(capture.url).to.include("/regular-transactions")
      })
    })

    describe("requests/transaction-files (unit)", function() {
      const resourceServerUrl = "https://api.example.com"
      const config = {resourceServerUrl} as any

      it("getTransactionFiles calls transaction files path", async function() {
        const capture: any = {}
        const api = transactionFilesFactory({config, request: createMockRequest(capture)})
        await api.getTransactionFiles({userId: "u1", transactionId: "tx1"})
        expect(capture.url).to.include("/transactions/tx1/files")
      })
    })

    describe("requests/transaction-splits (unit)", function() {
      const resourceServerUrl = "https://api.example.com"
      const config = {resourceServerUrl} as any

      it("getTransactionSplits calls splits path", async function() {
        const capture: any = {}
        const api = transactionSplitsFactory({config, request: createMockRequest(capture)})
        await api.getTransactionSplits({userId: "u1", transactionId: "tx1"})
        expect(capture.url).to.include("/transactions/tx1/splits")
      })
    })

    describe("requests/affordability (unit)", function() {
      const resourceServerUrl = "https://api.example.com"
      const config = {resourceServerUrl} as any

      it("createAffordability uses POST", async function() {
        const capture: any = {}
        const api = affordabilityFactory({config, request: createMockRequest(capture)})
        await api.createAffordability({userId: "u1"})
        expect(capture.url).to.equal(`${resourceServerUrl}/affordability`)
        expect(capture.opts.method).to.equal("POST")
      })

      it("getAffordability calls with id in path", async function() {
        const capture: any = {}
        const api = affordabilityFactory({config, request: createMockRequest(capture)})
        await api.getAffordability({userId: "u1", id: "aff1"})
        expect(capture.url).to.equal(`${resourceServerUrl}/affordability/aff1`)
        expect(capture.opts.cc.scope).to.equal("affordability:read")
      })

      it("getAllAffordability calls affordability URL with scope", async function() {
        const capture: any = {}
        const api = affordabilityFactory({config, request: createMockRequest(capture)})
        await api.getAllAffordability({userId: "u1"})
        expect(capture.url).to.equal(`${resourceServerUrl}/affordability`)
        expect(capture.opts.cc.scope).to.equal("affordability:read")
      })
    })

    describe("requests/auth-requests (unit)", function() {
      const identityServiceUrl = "https://identity.example.com"
      const config = {identityServiceUrl} as any

      it("createAuthRequest uses POST and auth-requests URL", async function() {
        const capture: any = {}
        const api = authRequestsFactory({config, request: createMockRequest(capture)})
        await api.createAuthRequest({} as any)
        expect(capture.url).to.include("/auth-requests")
        expect(capture.opts.method).to.equal("POST")
      })

      it("getAuthRequest calls with id in path", async function() {
        const capture: any = {}
        const api = authRequestsFactory({config, request: createMockRequest(capture)})
        await api.getAuthRequest({id: "ar1"})
        expect(capture.url).to.include("/auth-requests/ar1")
        expect(capture.opts.cc.scope).to.equal("auth_requests:read")
      })

      it("getAllAuthRequests calls auth-requests URL with read scope", async function() {
        const capture: any = {}
        const api = authRequestsFactory({config, request: createMockRequest(capture)})
        await api.getAllAuthRequests({})
        expect(capture.url).to.include("/auth-requests")
        expect(capture.opts.cc.scope).to.equal("auth_requests:read")
      })

      it("completeAuthRequest uses PATCH and body", async function() {
        const capture: any = {}
        const api = authRequestsFactory({config, request: createMockRequest(capture)})
        await api.completeAuthRequest({id: "ar1", authParams: {code: "c1"}})
        expect(capture.url).to.include("/auth-requests/ar1")
        expect(capture.opts.method).to.equal("PATCH")
        expect(capture.opts.body).to.eql({authParams: {code: "c1"}})
      })
    })

    describe("requests/payments (unit)", function() {
      const identityServiceUrl = "https://identity.example.com"
      const config = {identityServiceUrl} as any

      it("getPayment calls with id in path", async function() {
        const capture: any = {}
        const api = paymentsFactory({config, request: createMockRequest(capture)})
        await api.getPayment({id: "pay1"})
        expect(capture.url).to.equal(`${identityServiceUrl}/payments/pay1`)
        expect(capture.opts.cc.scope).to.equal("payment:read")
      })

      it("getPayments calls payments URL", async function() {
        const capture: any = {}
        const api = paymentsFactory({config, request: createMockRequest(capture)})
        await api.getPayments()
        expect(capture.url).to.equal(`${identityServiceUrl}/payments`)
      })
    })

    describe("requests/caas/accounts (unit)", function() {
      const caasResourceServerUrl = "https://caas.example.com"
      const config = {caasResourceServerUrl} as any

      it("caasDeleteAccount uses DELETE", async function() {
        const capture: any = {}
        const api = caasAccountsFactory({config, request: createMockRequest(capture)})
        await api.caasDeleteAccount({accountId: "acc1"})
        expect(capture.url).to.equal(`${caasResourceServerUrl}/accounts/acc1`)
        expect(capture.opts.method).to.equal("DELETE")
      })
    })

    describe("requests/caas/categories (unit)", function() {
      const caasResourceServerUrl = "https://caas.example.com"
      const config = {caasResourceServerUrl} as any

      it("caasGetCategories calls categories URL", async function() {
        const capture: any = {}
        const api = caasCategoriesFactory({config, request: createMockRequest(capture)})
        await api.caasGetCategories()
        expect(capture.url).to.equal(`${caasResourceServerUrl}/categories`)
      })
    })

    describe("requests/caas/users (unit)", function() {
      const caasResourceServerUrl = "https://caas.example.com"
      const config = {caasResourceServerUrl} as any

      it("caasDeleteUser uses DELETE", async function() {
        const capture: any = {}
        const api = caasUsersFactory({config, request: createMockRequest(capture)})
        await api.caasDeleteUser({userId: "u1"})
        expect(capture.url).to.equal(`${caasResourceServerUrl}/users/u1`)
        expect(capture.opts.method).to.equal("DELETE")
      })
    })

    describe("requests/caas/transactions (unit)", function() {
      const caasResourceServerUrl = "https://caas.example.com"
      const config = {caasResourceServerUrl} as any

      it("caasPatchTransaction uses PATCH and body", async function() {
        const capture: any = {}
        const api = caasTransactionsFactory({config, request: createMockRequest(capture)})
        await api.caasPatchTransaction({accountId: "a1", transactionId: "tx1", l2CategoryId: "cat1"})
        expect(capture.url).to.include("/accounts/a1/transactions/tx1")
        expect(capture.opts.method).to.equal("PATCH")
        expect(capture.opts.body).to.eql({l2CategoryId: "cat1"})
      })

      it("caasEnrichTransactions uses POST and enrich path", async function() {
        const capture: any = {}
        const api = caasTransactionsFactory({config, request: createMockRequest(capture)})
        await api.caasEnrichTransactions({transactions: []})
        expect(capture.url).to.include("/transactions/enrich")
        expect(capture.opts.method).to.equal("POST")
      })

      it("caasGetTransactions calls transactions URL with searchParams", async function() {
        const capture: any = {}
        const api = caasTransactionsFactory({config, request: createMockRequest(capture)})
        await api.caasGetTransactions({userId: "u1", accountId: "a1", limit: 10})
        expect(capture.url).to.equal(`${caasResourceServerUrl}/transactions`)
        expect(capture.opts.cc.scope).to.equal("caas:transactions:read")
        expect(capture.opts.searchParams).to.deep.include({accountId: "a1", userId: "u1", limit: 10})
      })

      it("caasDeleteTransaction uses DELETE", async function() {
        const capture: any = {}
        const api = caasTransactionsFactory({config, request: createMockRequest(capture)})
        await api.caasDeleteTransaction({accountId: "a1", transactionId: "tx1"})
        expect(capture.url).to.include("/accounts/a1/transactions/tx1")
        expect(capture.opts.method).to.equal("DELETE")
      })
    })

    describe("requests/osip (unit)", function() {
      const osipResourceServerUrl = "https://osip.example.com"
      const config = {osipResourceServerUrl} as any

      it("getOsipAccounts calls osip accounts URL", async function() {
        const capture: any = {}
        const api = osipFactory({config, request: createMockRequest(capture)})
        await api.getOsipAccounts({userId: "u1"})
        expect(capture.url).to.equal(`${osipResourceServerUrl}/accounts`)
      })

      it("getOsipAccount calls with accountId in path", async function() {
        const capture: any = {}
        const api = osipFactory({config, request: createMockRequest(capture)})
        await api.getOsipAccount({userId: "u1", accountId: "acc1"})
        expect(capture.url).to.equal(`${osipResourceServerUrl}/accounts/acc1`)
      })
    })
  })
})
