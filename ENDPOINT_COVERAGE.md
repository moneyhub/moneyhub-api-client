# Endpoint coverage: Swagger / API definition vs client

This document maps API definitions (Swagger and router definitions) to the moneyhub-api-client methods.

## 1. Request routing

| Config | Backend | Definition source |
|--------|---------|-------------------|
| `resourceServerUrl` | API Gateway (Data API) | api-gateway `swagger.json` (v2), `swagger-v3.json` (v3) |
| `identityServiceUrl` | Identity | identity `swagger.json` |
| `caasResourceServerUrl` | CaaS (Enrichment) | api-gateway `docs-enrichment-engine/swagger-enrichment-engine.json` |
| `osipResourceServerUrl` | OSIP | api-gateway `create-router.js` + `handlers/osip.js` (no Swagger) |

## 2. API Gateway (Data API) – client mapping

**Swagger:** api-gateway `docs/swagger.json` (basePath `/v2.0`), `docs/swagger-v3.json` (basePath `/v3`).

| Path / area | Client method(s) | Module | Notes |
|-------------|------------------|--------|--------|
| GET /accounts | getAccounts, getAccountsWithDetails | accounts | |
| GET /accounts-list | getAccountsList, getAccountsListWithDetails | accounts | **v2 only – no endpoint in v3** |
| GET/POST/PATCH/DELETE /accounts, /accounts/{id}, /balances | getAccount, getAccountWithDetails, getAccountBalances, createAccount, updateAccount, deleteAccount, addAccountBalance | accounts | |
| Holdings, counterparties, recurring-transactions, standing-orders, statements | getAccountHoldings, getAccountHoldingsWithMatches, getAccountHolding, getAccountCounterparties, getAccountRecurringTransactions, getAccountStandingOrders, getAccountStandingOrdersWithDetail, getAccountStatements, getAccountStatementsWithDetail | accounts | **v2 only:** /accounts-list, /accounts/{id}/counterparties, /accounts/{id}/recurring-transactions (not in v3 API) |
| Affordability | (affordability module) | affordability | |
| Beneficiaries | getBeneficiary, getBeneficiaryWithDetail, getBeneficiaries, getBeneficiariesWithDetail | beneficiaries | |
| GET /global-counterparties | getGlobalCounterparties | unauthenticated | |
| Transactions, files, splits | getTransactions, getTransaction, getUnenrichedTransactions, getUnenrichedTransaction, addTransaction, addTransactions, getTransactionFiles, getTransactionFile, addFileToTransaction, deleteTransactionFile, getTransactionSplits, splitTransaction, patchTransactionSplit, deleteTransactionSplits | transactions, transaction-files, transaction-splits | |
| Categories, category-groups | getCategories, getCategory, getCategoryGroups, getStandardCategories, getStandardCategoryGroups, createCustomCategory | categories | |
| Categorise, regular-transactions | categoriseTransactions, getRegularTransactions, detectRegularTransactions | categorise-transactions, regular-transactions | |
| Rental records | (rental-records module) | rental-records | |
| Spending analysis, spending/savings goals | getSpendingAnalysis, getSpendingGoals, getSpendingGoal, createSpendingGoal, updateSpendingGoal, deleteSpendingGoal, getSavingsGoals, getSavingsGoal, createSavingsGoal, updateSavingsGoal, deleteSavingsGoal | spending-analysis, spending-goals, savings-goals | |
| GET /standard-financial-statements, GET /standard-financial-statements/{reportId} | getStandardFinancialStatements, getStandardFinancialStatement | standard-financial-statements | |
| Sync, projects, tax | syncUserConnection, getProjects, getProject, addProject, updateProject, deleteProject, getTaxReturn | sync, projects, tax | |
| Notification thresholds | getNotificationThresholds, addNotificationThreshold, updateNotificationThreshold, deleteNotificationThreshold | notification-thresholds | |

## 3. Identity – client mapping

**Swagger:** identity `docs/swagger.json`.

| Path / area | Client method(s) | Module | Notes |
|-------------|------------------|--------|--------|
| GET .well-known/all-connections | listConnections | unauthenticated | |
| GET .well-known/api-connections | listAPIConnections | unauthenticated | |
| GET .well-known/legacy-connections | listLegacyConnections | unauthenticated | |
| GET .well-known/test-connections | listTestConnections | unauthenticated | |
| GET .well-known/payments-connections | listPaymentsConnections | unauthenticated | |
| GET .well-known/beta-connections | listBetaConnections | unauthenticated | |
| GET .well-known/openid-configuration | getOpenIdConfig | unauthenticated | |
| Auth-requests, OIDC | createAuthRequest, getAuthRequest, getAllAuthRequests, completeAuthRequest, getAuthUrls, token helpers | auth-requests, get-auth-urls, tokens | |
| Users, connections, syncs, SCIM | getUser, getUsers, registerUser, deleteUser, getUserConnections, deleteUserConnection, updateUserConnection, getConnectionSyncs, getUserSyncs, getSync, getSCIMUser, registerSCIMUser | users-and-connections | |
| Payees, pay-links, payments | addPayee, getPayees, getPayee, getPayment, getPayments, getPaymentFromIDToken, addPayLink, getPayLink, getPayLinks | payees, pay-links, payments | |
| Standing orders, recurring payments | getStandingOrder, getStandingOrders, getRecurringPayments, getRecurringPayment, makeRecurringPayment, revokeRecurringPayment, confirmFundsForRecurringPayment | standing-orders, recurring-payments | |
| Reseller-check, consent-history | createResellerCheckRequest, getConsentHistory | reseller-check, consent-history | |
| **Pay-file** | — | — | **No function available in this version of the client.** |
| **Pay-file-consent** | — | — | **No function available in this version of the client.** |
| **GET /bank-icons/{bankRef}** | — | — | **No function available in this version of the client.** |
| **GET /consents/{authRequestId}** | — | — | **No function available in this version of the client.** |

## 4. CaaS (Enrichment API) – client mapping

**Swagger:** api-gateway `docs/docs-enrichment-engine/swagger-enrichment-engine.json` (basePath `/caas/v1`).

| Path / area | Client method(s) | Module | Notes |
|-------------|------------------|--------|--------|
| DELETE /users/{userId} | caasDeleteUser | caas/users | |
| DELETE /accounts/{accountId} | caasDeleteAccount | caas/accounts | |
| GET /categories, /category-groups | caasGetCategories, caasGetCategoryGroups | caas/categories | |
| GET /counterparties | caasGetCounterparties | caas/counterparties | |
| GET /geotags | caasGetGeotags | caas/geotags | |
| GET/PATCH/DELETE /accounts/{accountId}/transactions/{transactionId} | caasGetTransactions, caasPatchTransaction, caasDeleteTransaction | caas/transactions | |
| POST /transactions/enrich | caasEnrichTransactions | caas/transactions | |
| Custom categories (users/{userId}/custom-categories) | caasGetCustomCategories, caasCreateCustomCategory, caasDeleteCustomCategory | caas/categories | |
| GET /accounts/{accountId}/regular-transactions | caasGetRegularTransactions | caas/regular-transactions | |
| GET …/transactions/{transactionId}/enhanced; PUT/DELETE …/splits | caasGetEnhancedTransaction, caasPutTransactionSplits, caasDeleteTransactionSplits | caas/enhanced-transactions, caas/transaction-splits | |

## 5. OSIP – client mapping

**Definition:** api-gateway `src/api/create-router.js` and `src/api/handlers/osip.js` (no Swagger).

| Method + path | Client method | Module |
|---------------|---------------|--------|
| GET /osip/v1.0/accounts | getOsipAccounts | osip |
| GET /osip/v1.0/accounts/:id | getOsipAccount | osip |
| GET /osip/v1.0/accounts/:id/holdings | getOsipAccountHoldings | osip |
| GET /osip/v1.0/accounts/:id/transactions | getOsipAccountTransactions | osip |

All require `osip:read` scope. Client fully covers these routes.

## 6. Integration test files

| Area | Test file(s) |
|------|--------------|
| Data API (accounts, transactions, etc.) | accounts.ts, accounts-with-extra-options.ts, transactions.ts, categories.ts, tax.ts, beneficiaries.ts, spending-analysis.ts, sync.ts, projects.ts, notification-thresholds.ts, regular-transactions.ts, rental-records.ts, savings-goals.ts, spending-goals.ts, transaction-files.ts, transaction-splits.ts, categorise-transactions.ts |
| Identity | auth-requests.ts, auth-urls.ts, payees.ts, pay-links.ts, payments.ts, standing-orders.ts, recurring-payments.ts, consent-history.ts, reseller-check.ts, users (via index) |
| Unauthenticated / connections | (listConnections etc. exercised via index or auth-urls) |
| CaaS | (optional; depends on env) |
| OSIP | osip.ts |
| Standard financial statements | standard-financial-statements.ts |

**Running tests**

- **Default config for Moneyhub developers**: see [Moneyhub API Client Tests Config](https://www.notion.so/moneyhub/Moneyhub-API-Client-Tests-Config-0bef6e3cb922425b88f0268c1a999917) for how to obtain and place the default `config` used by integration (and CaaS) tests.
- **Integration suite** (requires local config): `npm test` or `npm run test-ci`.
- **CaaS suite** (requires CaaS config): `npm run test-caas` or `npm run test-caas-ci`.
- Integration tests live in `src/__tests__/**/*.ts`; hooks in `test/hooks.js` provide `this.config` (e.g. `testUserId`, `testAccountId`).
