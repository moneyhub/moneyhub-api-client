
4.0.0 / 2021-01-11
==================

**Features**

* Allow passing requests timeout
* Allow passing Identity service url without `/oidc` suffix

**Bug Fixes**

* Update `openid-client` and `got` to fix security vulnerabilities

**Breaking Changes**

* Normalisation of all methods to use object destructuring to pass parameters.
  Please refer to the docs of each method when migrating to this version

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
