import {expect} from "chai"

import beneficiariesFactory from "../requests/beneficiaries"
import consentHistoryFactory from "../requests/consent-history"
import unauthenticatedFactory from "../requests/unauthenticated"
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
import caasAccountsFactory from "../requests/caas/accounts"
import caasCategoriesFactory from "../requests/caas/categories"
import caasUsersFactory from "../requests/caas/users"
import osipFactory from "../requests/osip"

const createMockRequest = (capture: {url?: string; opts?: any}) =>
  ((url: string, opts?: any) => {
    capture.url = url
    capture.opts = opts
    return Promise.resolve({data: []})
  }) as any

describe("requests modules (unit)", function() {
  describe("request modules (part 1)", function() {
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
