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
* Delete methods only return the status code when succesful
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
