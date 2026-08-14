7.1.0 / 2026-08-14
==========

**Tooling and development**

* Split test scripts into `test:unit` and `test:integration`; `test` runs both. Added `test:coverage` / `test:integration:coverage` with c8.
* Integration mocha configs exclude `*.unit.ts` so unit suites are not re-run under live API hooks.
* Husky pre-commit runs unit tests; pre-push runs serial multi-version unit smoke tests (Node 20/22/24/26 when installed via nvm), then integration once; CaaS tests only when `RUN_CAAS_TESTS=1`.
* Expanded unit coverage (discovery, auth URLs, request, tokens, requests modules) and additional integration coverage for existing endpoints.
* `.gitignore` / `.npmignore` updates for coverage and publish layout.

7.0.0 / 2026-08-14
==========

Major release: raises the Node.js engine to the current Active/LTS lines and upgrades tooling while remaining CommonJS.

**Breaking Changes**

* Node.js 18 is no longer supported; requires Node.js >= 20.20.0. (Node 12, 14, and 16 were already unsupported from 6.0.0.)
* Validation errors that previously threw a generic `"Missing parameters"` (often after a `console.error`) now throw more specific messages (e.g. `"Missing parameters: State is required"`). Callers that matched on the exact old string should update.
* Per-request retry options use nullish coalescing (`??`) instead of `||`, so falsy values such as `limit: 0` are respected rather than falling back to defaults.
* TypeScript is upgraded to v6 with `module` / `moduleResolution: Node16` (runtime output remains CommonJS). Downstream TypeScript consumers may need matching resolution settings when consuming the shipped `.d.ts` files.

**Dependency upgrades**

* Remains CommonJS: **jose** stays on v5 (`^5.10.0`), **query-string** on v7, **got** on v11, **openid-client** on v5 (later majors are ESM-only).
* **TypeScript** upgraded to v6; **ESLint** upgraded to v9 (flat config).
* **form-data** ^3.0.5 → ^4.0.5; **ramda** ^0.27.2 → ^0.32.0 (named imports).
* Dev dependencies: **@mft/eslint-config-momentumft**, mocha, husky 9, express 5, and related tooling updated.

**Tooling and development**

* Added `.nvmrc` (Node 20).
* Husky 9 hooks (no `_/husky.sh` wrapper); pre-push still runs lint, build, tests, and CaaS.

6.100.1 / 2026-08-18
==========

**Bug Fixes**

* Correct documentation and packaging hygiene ahead of 7.x: publish readme wording, endpoint coverage method names and test scripts, readme API examples, prerequisites URL, missing method docs (`accVerification`, `getPayee`, `getConsentHistory`, `confirmFundsForRecurringPayment`), CHANGELOG 6.99.0 phantom entry, package author typo, and `.npmignore` exclusions for `dist/__tests__` and env files.


6.100.0 / 2026-08-14
==========

**Features**

* **Standard financial statements**: `getStandardFinancialStatements` / `getStandardFinancialStatement` (scope `standard_financial_statement:read`).
* **Legacy connections**: `listLegacyConnections` (Identity `.well-known/legacy-connections`).
* `getAuthorizeUrl` with `accVerification: true` now adds `mh:account_verification` independently of `enableAsync` (previously nested under the async claim block).
* **ENDPOINT_COVERAGE.md** added to map API definitions to client methods.
* CHANGELOG backfill for undocumented 5.5.0–6.99.0 releases so history is complete ahead of the 7.x major line.

**Bug Fixes**

* Align `engines.node` with the 6.0.0 support policy: `>= 18.0.0` (Node 12, 14, and 16 were already unsupported from 6.0.0; `package.json` had incorrectly still declared `>= 12.0.0`).

6.99.0 / 2026-06-10
==========

**Features**

* Add CaaS custom category methods: `caasGetCustomCategories`, `caasCreateCustomCategory`, `caasDeleteCustomCategory`.

6.98.0 / 2026-06-09
==========

**Features**

* `caasGetTransactions` includes transaction `splits` when the client has the `caas:transaction_splits:read` scope (in addition to `caas:transactions:read`).

6.97.0 / 2026-06-04
==========

**Features**

* Add CaaS transaction split methods: `caasPutTransactionSplits`, `caasDeleteTransactionSplits`.
* Update CaaS transaction types.

6.96.0 / 2026-06-04
==========

**Features**

* Add `caasGetRegularTransactions` for CaaS `GET /accounts/{accountId}/regular-transactions`.
* Add `caasGetEnhancedTransaction` for CaaS enhanced transaction retrieval.
* Update counterparty types; gateway rewrite handling for versioned URL segments.
* Publishing: GitHub Actions npm publish with provenance and CI guards.

6.95.0 / 2026-02-23
==========

**Features**

* **Gateway behaviour**: When `gatewayIdentityServiceUrl` is set, discovery is fetched from it and endpoint URLs in the document are rewritten to that base (discovery `issuer` is left unchanged for JWT validation). When `gatewayResourceServerUrl`, `gatewayCaasResourceServerUrl`, or `gatewayOsipResourceServerUrl` is set, the client uses that URL for that API and rewrites response link URLs in the response body to it. When `gatewayAccountConnectUrl` is set, the client uses that URL for the account-connect API (request routing only; link rewriting applies to resource server, CaaS, and OSIP only). When a gateway URL is not set for a resource, no rewriting occurs for that resource.
* `getOpenIdConfig()` uses a TTL cache backed by `@isaacs/ttlcache` (configurable via `options.openIdConfigCacheTtlMs`) and returns discovery with endpoint URLs rewritten to `gatewayIdentityServiceUrl` only when that option is set.
* Identity URLs are detected for versioning via the effective identity base (no hardcoded path prefix list); when provided, any request URL under that base does not have an API version segment added.
* See the readme section **Using the client behind a gateway** for configuration, verification, and security notes.
* Add CaaS methods (categories, counterparties, geotags, transactions, users), including `caasPatchTransaction` and `caasEnrichTransactions`.
* Add consent history methods.
* Add confirmation-of-funds support for recurring payments / VRP.
* Update SCIM user create payload shape; optional amount for VRP confirmation of funds.
* Add `l1CategoryGroupId` / `l1CategoryGroupName` to CaaS category types.

6.94.0 / 2025-09-10
==========

**Features**

* Add unenriched transaction methods: `getUnenrichedTransactions`, `getUnenrichedTransaction`.

6.93.1 / 2025-07-18
==========

**Features**

* Add `providerAccountId` to the Account schema.

6.93.0 / 2025-07-15
==========

**Features**

* Add `providerParentAccountId` to the Account type (e.g. Monzo pots support).

6.92.0 / 2025-05-19
==========

**Features**

* Add `categoriseTransactions` method and related types/examples.

6.91.0 / 2025-05-01
==================

**Features**

* Add options for proxy agents
* Add createResellerCheckRequest method

6.9.0 / 2025-03-20
==========

**Features**

* Add `env` to create auth request params.

6.8.0 / 2025-03-12
==================

* Update User Connection Types

6.7.0 / 2025-02-25
==========

**Breaking Changes**

* Remove `getSCIMUsers` method.

**Bug Fixes**

* Fix `registerSCIMUser` TypeScript definitions.

6.6.0 / 2025-02-04
==========

**Features**

* Add configurable request retry options.
* Export connections types from the package index.

6.5.2 / 2025-01-21
==========

**Bug Fixes**

* Patch release published to npm (exact commit not retained in the current repository history).

6.5.1 / 2025-01-15
==========

**Bug Fixes**

* Patch / version bump release.

6.5.0 / 2025-01-14
==========

**Features**

* Add mTLS options to client configuration.
* Add `accVerification` / account verification support on auth requests and authorisation URLs.
* Add `targetDate` support on savings goals; adjust update savings goal behaviour.
* Add `revokedAt` to VRP response type.
* Make `sub` and client secret optional where not required by the auth method.
* Add max retry-after option for requests.

6.4.0 / 2024-08-27
==========

**Features**

* Add `getSCIMUser` method.

6.3.0 / 2024-08-06
==========

**Features**

* Add `registerSCIMUser` method.

6.2.0 / 2024-08-05
==========

**Features**

* Add `accountTypes` and `accountIdentification` to auth requests.
* Update recurring payment types.

6.1.2 / 2024-06-19
==========

**Features**

* Update pay-link types with additional parameters.

6.1.1 / 2024-05-21
==========

**Features**

* Add `payerType: api-payer` and payer to payment claims.

6.1.0 / 2024-04-23
==========

**Features**

* Add account statements methods.
* Support API v3 URL handling and related refactoring.

6.0.0 / 2024-04-08
==================

**Breaking Changes**

* End-Of-Life versions of Node.js as of October 2023 are no longer supported. Requires Node.js >= 18.0.0 (supports Node.js 18, 20, and future releases). Node 12, 14, and 16 are unsupported from this release.

**Features**

* Add permissionsAction to authorisation URL generation methods.
* Add customerIpAddress and customerLastLoggedTime to createAuthRequest

5.91.2 / 2023-12-05
==========

**Bug Fixes**

* Patch release published to npm (exact commit not retained in the current repository history).

5.91.1 / 2023-11-15
==========

**Bug Fixes**

* Patch / version bump release.

5.91.0 / 2023-11-15
==========

**Features**

* Add pay-link methods.

5.9.0 / 2023-11-14
==========

**Features**

* Maintenance / packaging release.

5.8.0 / 2023-09-11
==========

**Features**

* Add automatic versioning of API URLs with customisation.
* Add `enableAsync` option for syncs.

5.7.0 / 2023-09-11
==================

**Features**

* Add OSIP methods
* Add balance notification threshold methods

5.6.1 / 2023-09-06
==================

**Bug Fixes**

* Change registerUser's clientUserId type annotation to be optional

5.6.0 / 2023-07-24
==================

**Features**

* Add detectRegularTransactions

5.5.0 / 2023-07-25
==========

**Features**

* Intermediate release published the same day as 5.6.0 (see 5.6.0 for `detectRegularTransactions`).

5.4.0 / 2023-06-19
==================

**Features**

* Requests to query data can have client provided access tokens passed in, instead of relying on us to request an access token per request. Thus allowing to complete single use with the client library.

5.3.0 / 2023-05-31
==================

**Features**

* All authorisation URL generating methods use Pushed Authorisation Requests (PAR) instead of JWT Secured Authorisation Requests (JAR)

5.2.1 / 2023-01-19
==================

**Features**

* Add accountsList
* Add accountsListWithDetails

5.2.0 / 2023-01-03
==================

**Features**

* Add addAccountBalance
* Add updateAccount

5.1.2 / 2022-10-21
==================

**Features**

* Rename transactionsFromDateTime to `transactionFromDateTime` for auth requests body

5.1.1 / 2022-10-10
==================

**Features**

* Update exchangeCodeForTokens to make `nonce` optional

5.1.0 / 2022-09-15
==================

**Features**

* Update getAccountCounterparties to include version
* Update getPaymentAuthorizeUrl to accept a payee instead of payeeId
* Update getRecurringPaymentAuthorizeUrl to accept a payee instead of payeeId
* Update getStandingOrderAuthorizeUrl to accept a payee instead of payeeId
* Update create-payement example to accept a payee instead of payeeId
* Update create-standing-order example to accept a payee instead of payeeId

5.0.0 / 2022-08-16
==================

**Features**

* Migrated API client to Typescript
* Update getReversePaymentAuthorizeUrl to accept payerId and payerType

**Bug fixes**

* Fix form data for addFileToTransaction

4.20.0 / 2022-06-07
==================

**Features**

* Add listBetaConnections
* Add getReconsentAuthorizeUrlForCreatedUser
* Add updateUserConnection

4.19.0 / 2022-05-11
==================

**Features**

* Add getSpendingAnalysis

4.18.0 / 2022-04-22
==================

**Features**

* Add getSync
* Add getConnectionSyncs

4.17.0 / 2022-04-13
==================

**Features**

* Add AIS consent options to following methods:
- `getAuthorizeUrl`
- `getAuthorizeUrlForCreatedUser`
- `getReauthAuthorizeUrlForCreatedUser`
- `getRefreshAuthorizeUrlForCreatedUser`

4.13.0 / 2022-01-05
==================

**Features**

* Add getRentalRecords
* Add createRentalRecord
* Add deleteRentalRecord

4.0.0 / 2021-01-11
==================

**Features**

* Allow passing requests timeout
* Allow passing Identity service url without `/oidc` suffix

**Bug Fixes**

* Update `openid-client` and `got` to fix security vulnerabilities

**Breaking Changes**

* Normalisation of all methods to use object destructuring to pass parameters. Please refer to the docs of each method when migrating to this version
* Delete methods only return the status code when successful
* All methods to retrieve data return the body response as json, on previous versions some methods were returning the full response from the got library.
* When our API response code is not 2xx an HTTP error is thrown. Includes a response property with more information.
* Removal of all the methods with the suffix `WithToken`. To migrate to this version you can use the method with the same name but without the suffix. e.g `getUserConnectionsWithToken()` => `getUserConnections()`

  - registerUserWithToken
  - getUserConnectionsWithToken
  - deleteUserConnectionWithToken
  - deleteUserWithToken
  - getAccountsWithToken
  - getAccountWithToken
  - getAccountHoldingsWithToken
  - getTransactionsWithToken
  - syncUserConnectionWithToken



3.7.0 / 2020-07-27
==================

* Add getGlobalCounterparties

3.6.0 / 2020-07-21
==================

  * Add addFileToTransaction
  * Add getTransactionFiles
  * Add getTransactionFile
  * Add deleteTransactionFile

3.5.0 / 2020-07-14
==================

  * Add getAccountCounterparties
  * Add getAccountRecurringTransactions

3.4.0 / 2020-07-09
==================

  * Add CRUD project actions
  * Project ID query added to transaction end point

3.2.0 / 2020-05-26
==================

  * Added payer id and types to payment request

3.1.0 / 2020-05-20
==================

  * Add getPaymentFromIDToken method

3.0.1 / 2020-05-14
==================

  * Add support for sending `sub` when exchanging the auth code
  * Allow passing local params when exchanging the auth code

2.5.0 / 2019-12-06
==================

  * Add sync connection methods

2.1.0 / 2019-05-17
==================

  * Allow passing params to getAccounts and getTransactions

2.0.0 / 2019-05-17
==================

  * Change getAccounts method to receive userId instead of token
  * Add getAccountsWithToken
  * Change getTransactions method to receive userId instead of token
  * Add getTransactionsWithToken
  * Update examples to use command-line-args

1.17.0 / 2019-05-13
==================

  * Add getAccount method
