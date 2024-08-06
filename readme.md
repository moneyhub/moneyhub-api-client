# Moneyhub API Client

## Introduction

This is an Node.JS client for the [Moneyhub API](https://docs.moneyhubenterprise.com/docs). It currently supports the following features:

- Getting the list of supported banks
- Registering users
- Deleting users
- Generating authorisation urls for new and existing users
- Getting access tokens and refresh tokens from an authorisation code
- Refreshing access tokens
- Deleting user connections
- Getting access tokens with client credentials
- CRUD actions for accounts
- CRUD actions for transactions
- Generate authorisation url for payments
- Add Payees
- Get Payees and payments
- Add Pay links
- Get Pay links
- Get categories
- CRUD actions on projects
- CRUD actions on transaction attachments
- CRUD actions on transaction splits
- Get a tax return for a subset of transactions
- Get the regular transactions on an account
- Get beneficiaries

Currently this library supports `client_secret_basic`, `client_secret_jwt` and `private_key_jwt` authentication.

## Upgrading from 3.x

The breaking changes when upgrading are outlined below:

- Normalisation of all methods to use object destructuring to pass parameters. Please refer to the docs of each method when migrating to this version

- Delete methods only return the status code when succesful

- All methods to retrieve data return the body response as json, on previous versions some methods were returning the full response from the got library.

- When our API response code is not 2xx an HTTP error is thrown. Includes a response property with more information.

- Removal of all the methods with the suffix `WithToken`. To migrate to this version you can use the method with the same name but without the suffix. e.g `getUserConnectionsWithToken()` => `getUserConnections()`

For the full list of changes please refer to the [changelog](CHANGELOG.md)

## Upgrading from 4.x

The major upgrade from version 4.x is that the library now caters for TypeScript. To allow for this, the factory method that creates the client instance is now a named export rather than a default export.

```js
// v4.x
const Moneyhub = require("@mft/moneyhub-api-client")

// v5.x
const {Moneyhub} = require("@mft/moneyhub-api-client")
```

## Changelog

[Learn about the latest improvements and breaking changes](CHANGELOG.md).

## Prerequisites

To use this API client you will need:

- A `client_id`, `client_secret` and `redirect_uri` of a registered API client
- The url of the Moneyhub identity service for the environment you are connecting to (https://identity.moneyhub.co.uk)
- The url for the API gateway for the environment that you are connecting to (https://api.moneyhub.co.uk/v2.0)

## To install

`npm install @mft/moneyhub-api-client`

## Usage

This module exposes a single factory function that accepts the following configuration:

```javascript
const {Moneyhub} = require("@mft/moneyhub-api-client")
const moneyhub = await Moneyhub({
  resourceServerUrl: "https://api.moneyhub.co.uk/v3",
  identityServiceUrl: "https://identity.moneyhub.co.uk",
  options: { // optional
    timeout: 60000
  }
  client: {
    client_id: "your client id",
    client_secret: "your client secret",
    token_endpoint_auth_method: "client_secret_basic",
    id_token_signed_response_alg: "RS256",
    request_object_signing_alg: "none",
    redirect_uri: "https://your-redirect-uri",
    response_type: "code",
    keys: [
      /* your jwks */
    ],
  },
})
```
## Options
When making calls to our methods that require authentication, you can provide an extra argument at the end of these methods. This argument must be an object with these optional keys:

```js
{
  token: "full.access.token" // if specified will be added to authorisation header of request
  headers: {
    Authorization: "Bearer full.access.token" // can be used to specify authorisation header or additional headers
  }
}
```
Example usages

```javascript
const accounts = await moneyhub.getAccounts({
  userId: "user-id",
  params: {},
}, {});

const accounts = await moneyhub.getAccounts({
  params: {},
}, {
  token: "full.access.token"
});

const accounts = await moneyhub.getAccounts({
  params: {},
}, {
  headers: {
    Authorization: "Bearer full.access.token"
  }
});
```

At least one of the following parameters needs to be passed in to any api call that requires user authentication:

- **userId**: Automatically requests a token for this userId with the correct scopes
- **token**: The token will be added as bearer authorization header
- **Authorization header**: The full authorisation header can be passed in

## API
Once the api client has been initialised it provides a simple promise based interface with the following methods:

### Auth API

The options below can be set on the following URL generating methods:

- `getAuthorizeUrl`
- `getAuthorizeUrlForCreatedUser`
- `getReauthAuthorizeUrlForCreatedUser`
- `getRefreshAuthorizeUrlForCreatedUser`

The `expirationDateTime` and `transactionFromDateTime` options can be set according to the [AIS Consents documentation](https://docs.moneyhubenterprise.com/docs/ais-consents)

Set `enableAsync` to true if you wish to make an AIS connection that won't wait for accounts and transactions to be fetched.

**Note:** all methods generate an authorise URL using the Pushed Authorisation Request (PAR) method, see [here](https://docs.moneyhubenterprise.com/docs/pushed-authorisation-requests-par) for more details.

#### `getAuthorizeUrl`

This method returns an authorize url for your API client. You can redirect a user to this url, after which they will be redirected back to your `redirect_uri`.

[Financial institutions](https://docs.moneyhubenterprise.com/docs/bank-connections)

[Scopes](https://docs.moneyhubenterprise.com/docs/scopes)

[Claims](https://docs.moneyhubenterprise.com/docs/claims)

```javascript
const url = await moneyhub.getAuthorizeUrl({
  scope: "openid bank-id-scope other-data-scopes",
  state: " your state value", // optional
  nonce: "your nonce value", //optional
  claims: claimsObject, // optional
  permissions: ["ReadBeneficiariesDetail"], // optional - set of extra permissions to set for auth URL
  permissionsAction: "replace" // optional - replace default consent permissions. Defaults to "add"
  expirationDateTime: "2022-09-01T00:00:00.000Z", // optional
  transactionFromDateTime: "2020-09-01T00:00:00.000Z", // optional,
  enableAsync: false, // optional
});

// Default claims if none are provided
const defaultClaims = {
  id_token: {
    sub: {
      essential: true,
    },
    "mh:con_id": {
      essential: true,
    },
  },
};
```

#### `getAuthorizeUrlForCreatedUser`

This is a helper function that returns an authorize url for a specific user to connect to a specific bank. This function uses the following scope with the value of the bankId provided `id:${bankId} openid`.

[Financial institutions](https://docs.moneyhubenterprise.com/docs/bank-connections)

[Scopes](https://docs.moneyhubenterprise.com/docs/scopes)

[Claims](https://docs.moneyhubenterprise.com/docs/claims)

```javascript
const url = await moneyhub.getAuthorizeUrlForCreatedUser({
  bankId: "bank id to connect to",
  userId: "user id returned from the registerUser call",
  state: "your state value", // optional
  nonce: "your nonce value", // optional
  claims: claimsObject, // optional
  permissions: ["ReadBeneficiariesDetail"], // optional - set of extra permissions to set for auth URL
  permissionsAction: "replace" // optional - replace default consent permissions. Defaults to "add"
  enableAsync: false, // optional
});

// Scope used with the bankId provided
const scope = `id:${bankId} openid`;

// Default claims if none are provided
const defaultClaims = {
  id_token: {
    sub: {
      essential: true,
      value: userId, // userId provided
    },
    "mh:con_id": {
      essential: true,
    },
  },
};
```

#### `getReauthAuthorizeUrlForCreatedUser`

This is a helper function that returns an authorize url for a specific user to re authorize an existing connection. This function uses the scope `openid reauth`.

```javascript
const url = await moneyhub.getReauthAuthorizeUrlForCreatedUser({
  userId: "the user id",
  connectionId: "connection Id to re authorize",
  state: "your state value", // optional
  nonce: "your nonce value", // optional
  claims: claimsObject, // optional
  enableAsync: false, // optional
});

// Default claims if none are provided
const defaultClaims = {
  id_token: {
    sub: {
      essential: true,
      value: userId, // userId provided
    },
    "mh:con_id": {
      essential: true,
      value: connectionId, // connectionId provided
    },
  },
};
```

#### `getReconsentAuthorizeUrlForCreatedUser`

This is a helper function that returns a url for a specific user to reconsent an existing connection. This function uses the scope `openid reconsent`. The `expiresAt` date cannot be set to more than 90 days in the future. If `expiresAt` is not provided it will default to a date 90 days in the future. **Please note - this method should only be used for connections that have `tppConsent` set as `true`**.

```javascript
const url = await moneyhub.getReconsentAuthorizeUrlForCreatedUser({
        userId: "user id",
        connectionId: "connection ID to reconsent",
        state: "your state value", // optional
        nonce: "your nonce value", // optional
        claims: claimsObject // optional
        expiresAt: "ISO date-time string for new expiry of the connection" // optional - defaults to 90 days in future
});

// Default claims if none are provided
const defaultClaims = {
  id_token: {
    sub: {
      essential: true,
      value: userId, // userId provided
    },
    "mh:con_id": {
      essential: true,
      value: connectionId, // connectionId provided
    },
    "mh:consent": {
      value: {
        expirationDateTime: expiresAt, // expiresAt provided. If not provided defaults to a date 90 days in the future
      },
    },
  },
};
```

#### `getRefreshAuthorizeUrlForCreatedUser`

#### `getAuthorizeUrlLegacy`

This method returns an authorize url for your API client using the legacy method (where a request object is generated and passed in as the `request` query parameter). You can redirect a user to this url, after which they will be redirected back to your `redirect_uri`. It has the same method signature as `getAuthorizeUrl`

```javascript
const url = await moneyhub.getAuthorizeUrlLegacy({
  scope: "openid bank-id-scope other-data-scopes",
  state: " your state value", // optional
  nonce: "your nonce value", //optional
  claims: claimsObject, // optional
  permissions: ["ReadBeneficiariesDetail"], // optional - set of extra permissions to set for auth URL
  permissionsAction: "replace" // optional - replace default consent permissions. Defaults to "add"
  expirationDateTime: "2022-09-01T00:00:00.000Z", // optional
  transactionFromDateTime: "2020-09-01T00:00:00.000Z", // optional,
  enableAsync: false, // optional
});
```

This is a helper function that returns an authorize url for a specific user to refresh an existing connection. This function uses the scope `openid refresh`. (Only relevant for legacy connections)

```javascript
const url = await moneyhub.getRefreshAuthorizeUrlForCreatedUser({
  userId: "the user id",
  connectionId: "connection Id to re refresh",
  state: "your state value", // optional
  nonce: "your nonce value", // optional
  claims: claimsObject, // optional
  enableAsync: false, // optional
});

// Default claims if none are provided
const defaultClaims = {
  id_token: {
    sub: {
      essential: true,
      value: userId, // userId provided
    },
    "mh:con_id": {
      essential: true,
      value: connectionId, // connectionId provided
    },
  },
};
```

#### `exchangeCodeForTokensLegacy`

This is a legacy method to get tokens for a user.
After a user has succesfully authorised they will be redirected to your redirect_uri with an authorization code. You can use this to retrieve access, refresh and id tokens for the user.

```javascript
const tokens = await moneyhub.exchangeCodeForTokens({
  code: "the authorization code",
  nonce: "your nonce value", // optional
  state: "your state value", // optional
  id_token: "your id token", // optional
});
```

#### `exchangeCodeForTokens`

After a user has succesfully authorised they will be redirected to your redirect_uri with an authorization code. You can use this method to retrieve access, refresh and id tokens for the user.

The signature for this method changed in v3.
The previous function is available at 'exchangeCodeForTokensLegacy'

This method requires an object with two properties:

- `paramsFromCallback` : an object with all the params received at your redirect uri
- `localParams` : an object with params that you have in the local session for the user.

```javascript
const tokens = await moneyhub.exchangeCodeForTokens({
  paramsFromCallback: {
    "code": "the auth code",
    "id_token": "the id_token", // when code id_token response type is used
    "state": "state",
  },
  localParams: {
    "state": "state", // this must be from the local session not the redirect uri
    "nonce": "nonce", // this must be from the local session
    "sub": "the user id", // optional, but without this param, requests where there are missing cookies will fail
    "max_age", // optional, not normally required
    "response_type" // recommended to enhance securirty
    "code_verifier" // required if PKCE is used
  }
})
```

#### `getClientCredentialTokens`

Use this to get a client credentials access token.

```javascript
const tokens = await moneyhub.getClientCredentialTokens({
  scope: "the-required-scope",
  sub: "the user id", // optional
});
```

#### `refreshTokens`

Use this to get a new access token using a refresh token

```javascript
const tokens = await moneyhub.refreshTokens({
  refreshToken: "refresh-token",
});
```

### Auth Request URI

#### `requestObject`

Creates a request object

```javascript
const tokens = await moneyhub.requestObject({
  scope: "the-required-scope",
  state: "state",
  nonce: "nonce",
  claims: claimsObject,
});
```

#### `getRequestUri`

Use this to create a request uri from a request object

```javascript
const requestUri = await moneyhub.getRequestUri(requestObject);
```

#### `getAuthorizeUrlFromRequestUri`

Use this to retrieve an authorization url from a request uri

```javascript
const url = await moneyhub.getAuthorizeUrlFromRequestUri({
  requestUri: "request-uri",
});
```

### Auth Requests

#### `createAuthRequest`

Creates a connection auth request

```javascript
const tokens = await moneyhub.createAuthRequest({
  redirectUri: "redirect-uri",
  userId: "user-id",
  scope: "openid 1ffe704d39629a929c8e293880fb449a", // replace bank id with the bank you want to connect to
  categorisationType: "personal", // optional - defaults to personal
  permissions: ["ReadBeneficiariesDetail"], // optional - set of extra permissions to set for auth request
  permissionsAction: "replace" // optional - replace default consent permissions. Defaults to "add"
});
```

Creates a reauth auth request

```javascript
const tokens = await moneyhub.createAuthRequest({
  redirectUri: "redirect-uri",
  userId: "user-id",
  connectionId: "connection-id",
  scope: "openid reauth",
});
```

Creates a refresh auth request

```javascript
const tokens = await moneyhub.createAuthRequest({
  redirectUri: "redirect-uri",
  userId: "user-id",
  connectionId: "connection-id",
  scope: "openid refresh",
});
```

Creates a payment auth request

```javascript
const tokens = await moneyhub.createAuthRequest({
  redirectUri: "redirect-uri",
  userId: "user-id",
  connectionId: "connection-id",
  scope: "openid payment",
  payment: {
    payeeId: "payee-id",
    amount: 200,
    payeeRef: "Payee ref",
    payerRef: "Payer ref",
  },
});
```

Creates a reverse payment auth request

```javascript
const tokens = await moneyhub.createAuthRequest({
  redirectUri: "redirect-uri",
  userId: "user-id",
  connectionId: "connection-id",
  scope: "openid reverse_payment",
  reversePayment: {
    paymentId: "payment-id",
  },
});
```

#### `completeAuthRequest`

Completes an auth request succesfully

```javascript
const tokens = await moneyhub.completeAuthRequest({
  id: "auth-request-id",
  authParams: {
    code: "code"
    state: "state",
    "id_token": "idToken",
  }
})
```

Completes an auth request with an error

```javascript
const tokens = await moneyhub.completeAuthRequest({
  id: "auth-request-id",
  authParams: {
    error: "error-code",
    error_description: "error description",
  },
});
```

#### `getAllAuthRequests`

Retrieves auth requests

```javascript
const tokens = await moneyhub.getAllAuthRequests({
  limit: 10, // optional
  offset: 0, // optional
});
```

#### `getAuthRequest`

Retrieve a single auth request

```javascript
const tokens = await moneyhub.getAuthRequest({
  id: "auth-request-id",
});
```

### User Management

#### `registerUser`

Helper method that gets the correct client credentials access token and then registers a user.

```javascript
const user = await moneyhub.registerUser({
  clientUserId: "your user id", // optional
});
```

#### `getUsers`

Returns all the users registered for your api-client

```javascript
const users = await moneyhub.getUsers({
  limit,
  offset,
  isDemo,
});
```

#### `getUser`

Get a single user by their id

```javascript
const user = await moneyhub.getUser({
  userId: "user-id",
});
```

#### `deleteUser`

Helper method that gets the correct client credentials access token and then deletes a user.

```javascript
const user = await moneyhub.deleteUser({
  userId: "user-id",
});
```

### User Connections

#### `getUserConnections`

Helper method that gets the correct client credentials access token and then gets all user connections.

```javascript
const user = await moneyhub.getUserConnections({
  userId: "user-id",
}, options);
```

#### `syncUserConnection`

Sync an existing user connection. This process will fetch the latest balances and transactions of the accounts attached to the connection. This method only returns the status of the syncing.

```javascript
const tokens = await moneyhub.syncUserConnection({
  userId,
  connectionId,
  customerIpAddress, // optional
  customerLastLoggedTime, // optional
  enableAsync, // optional
}, options);
```

#### `deleteUserConnection`

Helper method that gets the correct client credentials access token and then deletes a user connection.

```javascript
const user = await moneyhub.deleteUserConnection({
  userId: "user-id",
  connectionId: "connection-id",
}, options);
```

#### `getConnectionSyncs`

Retrieve the syncs for a given connection ID.

```javascript
const syncs = await moneyhub.getConnectionSyncs({
  userId: "user-id",
  connectionId: "connection-id",
  params: {
    limit: 10,
    offset: 0,
  },
}, options);
```

#### `getUserSyncs`

Retrieve the syncs for a given connection ID.

```javascript
const syncs = await moneyhub.getUserSyncs({
  userId: "user-id",
  params: {
    limit: 10,
    offset: 0,
  },
}, options);
```

#### `getSync`

Retrieve the syncs for the given sync ID.

```javascript
const syncs = await moneyhub.getSync({
  userId: "user-id",
  syncId: "sync-id",
}, options);
```

#### `updateUserConnection`

Helper method that updates a connection. Requires scope `user:update`. Currently only the consent can be updated by updating the `expiresAt` field. This field should be a valid date-time ISO string and not be more than 90 days away. This method can only be used by those clients that have bypassed consent (the `Enforce user consent` option in the Admin Portal). If successful returns a 204.

```javascript
const user = await moneyhub.updateUserConnection({
  userId: "user-id",
  connectionId: "connection-id",
  expiresAt: "2022-06-26T09:43:16.318+00:00"
}, options)
```

### SCIM User Management

Registers a SCIM user.

```javascript
const user = await moneyhub.registerUser({
  externalId: "your user id", 
  name: {
     givenName: "Andrea",
    familyName: "Hedley"
  },
  emails: [{
    value: "andrea.hedley@moneyhub.com"
  }]
});
```

### Data API

#### `getAccounts`

Get all accounts for a user. This function uses the scope `accounts:read`.

```javascript
const queryParams = { limit: 10, offset: 5 , showTransacionData: false, showPerformanceScore: true};
const accounts = await moneyhub.getAccounts({
  userId: "userId",
  params: queryParams,
}, options);
```

#### `getAccountsWithDetails`

Get all accounts for a user including extra details (sort code, account number, account holder name). This function uses the scopes `accounts:read accounts_details:read`.

```javascript
const queryParams = { limit: 10, offset: 5 };
const accounts = await moneyhub.getAccountsWithDetails({
  userId: "userId",
  params: queryParams,
}, options);
```

#### `getAccountsList`

Similar to getAccounts method, however this method does not return `transactionData` and `performanceScore` by default meaning data can be retrieved more quickly. These fields can still be returned on from this method by using `showTransacionData` and `showPerformanceScore` query params. This function uses the scope `accounts:read`.

```javascript
const queryParams = { limit: 10, offset: 5 , showTransacionData: false, showPerformanceScore: true};
const accounts = await moneyhub.getAccounts({
  userId: "userId",
  params: queryParams,
}, options);
```

#### `getAccountsListWithDetails`

Similar to getAccountsWithDetails method, however this method does not return `transactionData` and `performanceScore` by default meaning data can be retrieved more quickly. These fields can still be returned on from this method by using `showTransacionData` and `showPerformanceScore` query params. This function uses the scopes `accounts:read accounts_details:read`.

```javascript
const queryParams = { limit: 10, offset: 5 };
const accounts = await moneyhub.getAccountsWithDetails({
  userId: "userId",
  params: queryParams,
}, options);
```

#### `getAccount`

Get a single account for a user by the accountId. This function uses the scope `accounts:read`.

```javascript
const account = await moneyhub.getAccount({
  userId: "userId",
  accountId: "accountId",
}, options);
```

#### `getAccountWithDetails`

Get a single account for a user by the accountId including extra details (sort code, account number, account holder name). This function uses the scope `accounts:read accounts_details:read`.

```javascript
const account = await moneyhub.getAccountWithDetails({
  userId: "userId",
  accountId: "accountId",
}, options);
```

#### `getAccountBalances`

Get account balances for a user. This function uses the scope `accounts:read`.

```javascript
const account = await moneyhub.getAccountBalances({
  userId: "userId",
  accountId: "accountId",
}, options);
```

#### `getAccountHoldings`

Get account holdings for a user. This function uses the scope `accounts:read`.

```javascript
const account = await moneyhub.getAccountHoldings({
  userId: "userId",
  accountId: "accountId",
}, options);
```

#### `getAccountHoldingsWithMatches`

Get account holdings with ISIN codes matchers for a user. This function uses the scope `accounts:read`.

```javascript
const account = await moneyhub.getAccountHoldingsWithMatches({
  userId: "userId",
  accountId: "accountId",
}, options);
```

#### `getAccountHolding`

Get a single holding from a user's account. This function uses the scope `accounts:read`.

```javascript
const account = await moneyhub.getAccountHolding({
  userId: "userId",
  accountId: "accountId",
  holdingId: "holdingId",
}, options);
```

#### `getAccountCounterparties`

Get account counterparties for a user. This function uses the scope `accounts:read transactions:read`.

```javascript
const account = await moneyhub.getAccountCounterparties({
  userId: "userId",
  accountId: "accountId",
  params: {
    counterpartiesVersion: "v3",
  },
}, options);
```

#### `getAccountRecurringTransactions`

Get account recurring transactions for a user. This function uses the scope `accounts:read transactions:read`.

```javascript
const account = await moneyhub.getAccountRecurringTransactions({
  userId: "userId",
  accountId: "accountId",
}, options);
```

#### `getAccountStandingOrders`

Get the standing orders for an account. This function uses the scope `standing_orders:read` and a connection with `ReadStandingOrdersBasic` permission.

```javascript
const standingOrders = await moneyhub.getAccountStandingOrders({
  userId: "userId",
  accountId: "accountId",
}, options);
```

#### `getAccountStandingOrdersWithDetail`

Get the standing orders with detail (payee information) for an account. This function uses the scope `standing_orders_detail:read` and a connection with `ReadStandingOrdersDetail` permission.

```javascript
const standingOrders = await moneyhub.getAccountStandingOrdersWithDetail({
  userId: "userId",
  accountId: "accountId",
}, options);
```

#### `getAccountStatements`

Get the statements for an account. This function uses the scope `statements_basic:read` and a connection with `ReadStatementsBasic` permission.

```javascript
const statements = await moneyhub.getAccountStatements({
  userId: "userId",
  accountId: "accountId",
}, options);
```

#### `getAccountStatementsWithDetail`

Get the statements with detail for an account. This function uses the scope `statements_detail:read` and a connection with `ReadStatementsDetail` permission.

```javascript
const statements = await moneyhub.getAccountStatementsWithDetail({
  userId: "userId",
  accountId: "accountId",
}, options);
```

#### `createAccount`

Create a manual account for a user. This function uses the scopes `accounts:read accounts:write:all`

```javascript
const account = await moneyhub.createAccount({
  userId: "userId",
  account: {
    accountName: "Account name",
    providerName: "Provider name",
    type: "cash:current",
    accountType: "personal",
    balance: {
      date: "2018-08-12",
      amount: {
        value: 300023,
      },
    },
  },
}, options);
```

#### `deleteAccount`

Delete a manual account for a user. This function uses the scope `accounts:write:all`

```javascript
const result = await moneyhub.deleteAccount({
  userId: "userId",
  accountId: "accountId",
}, options);
```

#### `addAccountBalance`

Add a balance to a manual account. This function uses the scope `accounts:read accounts:write:all`

```javascript
const result = await moneyhub.addAccountBalance({
  userId: "userId",
  accountId: "accountId",
  balance: {
    amount: {
      value: 123
    },
    date: "2022-01-01",
  }
}, options);
```

#### `updateAccount`

Update manual account. This function uses the scope `accounts:read accounts:write:all`

```javascript
const result = await moneyhub.updateAccount({
  userId: "userId",
  accountId: "accountId",
  account: {
    accountName: "accountName",
    providerName: "providerName"
    details: {}
  }
}, options);
```

#### `getTransactions`

Get all transactions for a user. This function uses the scope `transactions:read:all`..

```javascript
const queryParams = { limit: 10, offset: 5 };
const transactions = await moneyhub.getTransactions({
  userId: "userId",
  params: queryParams,
}, options);
```

#### `getTransaction`

Get a transaction by ID for a user. This function uses the scope `transactions:read:all`..

```javascript
const transactions = await moneyhub.getTransaction({
  userId: "userId",
  transactionId: "transactionId",
}, options);
```

#### `updateTransaction`

Update a transaction by ID for a user. This function uses the scopes `transactions:read:all transactions:write:all`..

```javascript
const transactions = await moneyhub.updateTransaction({
  userId: "userId",
  transactionId: "transactionId",
  transaction: {
    amount: {
      value: 10,
    },
  },
}, options);
```

#### `addTransaction`

Add a transaction for a user. Please note, transaction must belong to an account that is transaction-able. This function uses the scopes `transactions:read:all transactions:write:all`..

```javascript
const transactions = await moneyhub.addTransaction({
  userId: "userId",
  transaction: {
    amount: {
      value: 10,
    },
  },
}, options);
```

#### `addTransactions`

Add up to 50 transactions for a user. Please note, transaction must belong to an account that is transaction-able. This function uses the scopes `transactions:read:all transactions:write:all`.

```javascript
const transactions = await moneyhub.addTransactions({
  userId: "userId",
  transactions: [
    {
      amount: {
        value: 10,
      },
    },
    {
      amount: {
        value: 25,
      },
    },
  ],
  params: {
    categorise: true, // optional - enable categorisatio for transactions
  },
}, options);
```

#### `deleteTransaction`

Delete a transaction for a user. This function uses the scopes `transactions:write:all`..

```javascript
const result = await moneyhub.deleteTransaction({
  userId: "userId",
  id: "transactionId",
}, options);
```

#### `getBeneficiaries`

Get all beneficiaries for a user. This function uses the scope `beneficiaries:read`

```javascript
const queryParams = { limit: 10, offset: 5 };
const beneficiaries = await moneyhub.getBeneficiaries({
  userId: "userId",
  params: queryParams,
}, options);
```

#### `getBeneficiariesWithDetail`

Get all beneficiaries for a user, including beneficiary detail. This function uses the scope `beneficiaries_detail:read`

```javascript
const queryParams = { limit: 10, offset: 5 };
const beneficiaries = await moneyhub.getBeneficiariesWithDetail({
  userId: "userId",
  params: queryParams,
}, options);
```

#### `getBeneficiary`

Get a beneficiary for a user. This function uses the scope `beneficiaries:read`

```javascript
const beneficiary = await moneyhub.getBeneficiary({
  userId: "userId",
  id: "beneficiaryId",
}, options);
```

#### `getBeneficiaryWithDetail`

Get a beneficiary for a user, including beneficiary detail. This function uses the scope `beneficiaries_detail:read`

```javascript
const beneficiary = await moneyhub.getBeneficiaryWithDetail({
  userId: "userId",
  id: "beneficiaryId",
}, options);
```

#### `addFileToTransaction`

Add an attachment to a transaction. This call requires an access token with a scope that allows it to read and write transactions. The third parameter must be a stream, and the size of the file being uploaded can be of max size 10MB.

```javascript
const file = await money.addFileToTransaction({
  userId: "userId",
  transactionId: "transactionId",
  fileName: "file-name",
  fileData: fs.createReadStream("path/to/file.png"),
}, options);
```

#### `getTransactionFiles`

Get all attachments associated with a transaction. This call requires an access token with a scope that allows it to read transactions.

```javascript
const files = await money.getTransactionFiles({
  userId: "userId",
  transactionId: "transactionId",
}, options);
```

#### `getTransactionFile`

Get an attachment associated with a transaction. This call requires an access token with a scope that allows it to read transactions.

```javascript
const files = await money.getTransactionFile({
  userId: "userId",
  transactionId: "transactionId",
  fileId: "fileId",
}, options);
```

#### `deleteTransactionFile`

Delete an attachment associated with a transaction. This call requires an access token with a scope that allows it to read and write transactions.

```javascript
await money.deleteTransactionFile({
  userId: "userId",
  transactionId: "transactionId",
  fileId: "fileId",
}, options);
```

#### `splitTransaction`

Split up a transaction into different categories and/or projects.

```javascript
const splits = await moneyhub.splitTransaction({
  userId: "userId",
  transactionId: "transactionId",
  splits: [
    {
      categoryId: "std:5a7ff1f3-cd2c-4676-a368-caf09f2ca35a",
      description: "Split 1",
      amount: -6000,
    },
    {
      categoryId: "std:eac238ec-3899-49ff-8cce-e3b9f4b1aede",
      description: "Split 2",
      amount: -4000,
    },
  ],
}, options);
```

#### `getTransactionSplits`

Get a transactions splits.

```javascript
const splits = await moneyhub.getTransactionSplits({
  userId: "userId",
  transactionId: "transactionId",
}, options);
```

#### `patchTransactionSplit`

Update a transaction's split's description, categoryId or projectId.

```javascript
const splits = await moneyhub.patchTransactionSplit({
  userId: "userId",
  transactionId: "transactionId",
  split: {
    description: "New description",
  },
}, options);
```

#### `deleteTransactionSplits`

Delete a transaction's splits and merge them back together.

```javascript
const splits = await moneyhub.deleteTransactionSplits({
  userId: "userId",
  transactionId: "transactionId",
}, options);
```

#### `getOsipAccounts`

Get all accounts for a user. This function uses the scope `osip:read`.

```javascript
const queryParams = { limit: 10, offset: 5 };
const accounts = await moneyhub.getOsipAccounts({
  userId: "userId",
  params: queryParams,
});
```

#### `getOsipAccount`

Get an account for a user. This function uses the scope `osip:read`.

```javascript
const queryParams = { limit: 10, offset: 5 };
const accounts = await moneyhub.getOsipAccounts({
  userId: "userId",
  accountId: "accountId",
  params: queryParams,
});
```

#### `getOsipAccountHoldings`

Get account holdings for an account. This function uses the scope `osip:read`.

```javascript
const queryParams = { limit: 10, offset: 5 };
const accounts = await moneyhub.getOsipAccounts({
  userId: "userId",
  accountId: "accountId",
  params: queryParams,
});
```

#### `getOsipAccountTransactions`

Get account transactions. This function uses the scope `osip:read`.

```javascript
const queryParams = { limit: 10, offset: 5 };
const accounts = await moneyhub.getOsipAccounts({
  userId: "userId",
  accountId: "accountId",
  params: queryParams,
});
```

#### `getGlobalCounterparties`

Get global counterparties.

```javascript
const accounts = await moneyhub.getGlobalCounterparties();
```

#### `getCategories`

Get all categories for a user. This function uses the scope `categories:read`.

```javascript
const categories = await moneyhub.getCategories({
  userId: "userId",
  params: {
    type: "personal", // optional personal|business
  },
}, options);
```

#### `getCategory`

Get a single category for a user. This function uses the scope `categories:read`.

```javascript
const category = await moneyhub.getCategory({
  userId: "userId",
  categoryId: "categoryId",
}, options);
```

#### `getCategoryGroups`

Get all category groups for a user. This function uses the scope `categories:read`.

```javascript
const categoryGroups = await moneyhub.getCategoryGroups({
  userId: "userId",
  params: {
    type: "personal", // optional personal|business
  },
}, options);
```

#### `getStandardCategories`

Get standard categories.

```javascript
const categories = await moneyhub.getStandardCategories({
  params: {
    type: "personal", // optional personal|business|all
  },
}, options);
```

#### `getStandardCategoryGroups`

Get standard categories.

```javascript
const categoryGroups = await moneyhub.getStandardCategoryGroups({
  params: {
    type: "personal", // optional personal|business|all
  },
}, options);
```

#### `createCustomCategory`

Create a custom category. This function uses the scopes `categories:read categories:write`.

```javascript

const category = await moneyhub.createCustomCategory({
  userId: "userId",
  category: {
    group: "group:1"
    name: "custom-category",
    },
  }, options)
```

### Spending analysis

#### `getSpendingAnalysis`

This method returns the spending analysis for the given dates. This function uses the scope `spending_analysis:read`

```javascript
const projects = await moneyhub.getSpendingAnalysis({
  userId: "userId",
  dates: [
    {
      name: "currentMonth",
      from: "2018-10-01",
      to: "2018-10-31",
    },
    {
      name: "previousMonth",
      from: "2018-09-01",
      to: "2018-09-30",
    },
  ],
  accountIds: ["ac9bd177-d01e-449c-9f29-d3656d2edc2e"], // optional
  categoryIds: ["std:338d2636-7f88-491d-8129-255c98da1eb8"], // optional
}, options);
```

### Projects

#### `getProjects`

This method returns a list of projects. This function uses the scope `projects:read`

```javascript
const projects = await moneyhub.getProjects({
  userId: "userId",
  params: {
    limit: "limit", // optional
    offset: "offset", // optional
  }, // optional
}, options);
```

#### `getProject`

Get a single project for a user by the projectId. This function uses the scope `projects:read`.

```javascript
const project = await moneyhub.getProject({
  userId: "userId",
  projectId: "projectId",
}, options);
```

#### `addProject`

Create a new project for a user. This function uses the scope `projects.write`. This will return the new project.

```javascript
const project = await moneyhub.addProject({
  userId: "userId",
  project: {
    name: "Project Name",
    accountIds: "id1,id2", // comma-separated list of account IDs
    type: "PropertyProject",
  },
}, options);
```

#### `updateProject`

Update a project for a user. This function uses the scope `projects.write`. This will return the newly updated project.

```javascript
const project = await moneyhub.updateProject({
  userId: "userId",
  projectId: "projectId",
  project: {
    name: "Updated Project Name",
    accountIds: "id1,id2", // comma-separated list of account IDs
    type: "PropertyProject",
    archived: false,
  },
}, options);
```

#### `deleteProject`

Delete a project for a user given a project ID. This function uses the scope `projects.delete`.

```javascript
const result = await moneyhub.deleteProject({
  userId: "userId",
  projectId: "projectId",
});
```

### Tax Return

#### `getTaxReturn`

Get a tax return object for a subset of transactions. This makes use of the `enhancedCategories` on transactions. This functions uses the scope `tax:read`

```javascript
const result = await moneyhub.getTaxReturn({
  userId: "userId",
  params: {
    startDate: "2020-01-01",
    endDate: "2020-02-01",
    accountId: "accountId",
    projectId: "projectId",
  },
}, options);
```

### Payments

#### `getPaymentAuthorizeUrl`

This is a helper function that returns an authorize url to authorize a payment to the payee with the bank selected. This function uses the following scope with the value of the bankId provided `payment openid id:${bankId}`. It also requires the authentication to be `client_secret_jwt` or `private_key_jwt`.

```javascript
const url = await moneyhub.getPaymentAuthorizeUrl({
  bankId: "Bank id to authorise payment from", // required
  payeeId: "Id of payee", // required or payee
  payee: "Details of payee to create", // required or payeeId
  payeeType: "Payee type [api-payee|mh-user-account]", // optional - defaults to api-payee
  payerType: "Payer type [mh-user-account | api-payer]", // required only if payerId or payer is used
  payerId: "Id of payer", // required only if payerType is defined as mh-user-account
  payer: "Details of payer to use", // required if using api-payer for payerType
  amount: "Amount in pence to authorize payment",
  payeeRef: "Payee reference",
  payerRef: "Payer reference",
  payerName: "Payer Name", // optional
  payerEmail: "Payer Email", // optional
  state: "your state value",
  nonce: "your nonce value", // optional
  context: "Payment context [Other,BillPayment,PartyToParty]", // optional - defaults to PartyToParty
  userId: "Moneyhub API User ID you wish to attach to the payment", // optional
  claims: claimsObject, // optional
});

// Scope used with the bankId provided
const scope = `payment openid id:${bankId}`;

// Default claims if none are provided
const defaultClaims = {
  id_token: {
    "mh:con_id": {
      essential: true,
    },
    "mh:payment": {
      essential: true,
      value: {
        amount,
        payeeRef,
        payerRef,
        payeeId,
        payeeType,
        payerId,
        payerType,
        payerName,
        payerEmail,
      },
    },
  },
};
```

#### `getReversePaymentAuthorizeUrl`

This is a helper function that returns an authorize url to authorize a reverse payment for a payment that is reversible. This function uses the following scope with the value of the bankId provided `reverse_payment openid id:${bankId}`. It also requires the authentication to be `client_secret_jwt` or `private_key_jwt`.

```javascript
const url = await moneyhub.getReversePaymentAuthorizeUrl({
  bankId: "Bank id to authorise payment from",
  paymentId: "Id of payment to reverse",
  state: "your state value",
  amount: "reverse payment amount" // optional
  nonce: "your nonce value", // optional
  claims: claimsObject, // optional
  payerType: "Payer type [mh-user-account | api-payer]", // required only if payerId or payer is used
  payerId: "payer id that will make the payment", // required if using mh-user-account for payerType
  payer: "Details of payer to use", // required if using api-payer for payerType
})

// Scope used with the bankId provided
const scope = `reverse_payment openid id:${bankId}`

// Default claims if none are provided
const defaultClaims = {
  id_token: {
    "mh:con_id": {
      essential: true,
    },
    "mh:payment": {
      essential: true,
    },
    "mh:reversePayment": {
      essential: true,
      value: {
        paymentId
      },
    },
  },
}
```

#### `addPayee`

This method will add a Payee. This will return an id that it is
required to be used as `payeeId` when initiating a payment. This function uses the scope `payee:create`

```javascript
const payee = await moneyhub.addPayee({
  accountNumber: "your account number",
  sortCode: "your sort code",
  name: "name of Payee",
  externalId: "your external id",
});
```

#### `getPayees`

This method returns a list of registered payees. This function uses the scope `payee:read`

```javascript
const payees = await moneyhub.getPayees({
  limit: "limit", // optional
  offset: "offset", // optional
  userId: "user-id", // optional
  hasUserId: true, // optional
});
```

#### `getPayments`

This method returns a list of initiated payments. This function uses the scope `payment:read`

```javascript
const payments = await moneyhub.getPayments({
  limit: "limit", // optional
  offset: "offset", // optional
  userId: "user-id", // optional
  payeeId: "payee-id", // optional
  startDate: "2020-01-01", // optional
  endDate: "2020-12-31", // optional
});
```

#### `getPayment`

Get a single payment by its id . This function uses the scope `payment:read`

```javascript
const paymentData = await moneyhub.getPayment({
  id: "payment-id",
});
```

#### `getPaymentFromIDToken`

When a payment flow is completed and you call `exchangeCodeForTokens`
you will receive back an ID Token that contains the payment id. This is a utility function to get the payment data using the id in the ID Token.

```javascript
const paymentData = await moneyhub.getPaymentFromIDToken({
  idToken: "eyJhbGciOiJSUz...",
});
```

#### `addPayLink`

Create a pay-link for dynamically created party-to-party payments using your custom themed widget. This function uses the scope `pay_link:create`. You will receive back the pay-link details as well as the pay-link id in the response. With that id you can then render the widget i.e. https://identity.moneyhub.co.uk/widget-pages/widget-id#payLinkId=pay-link-id

```javascript
const paymentData = await moneyhub.addPayLink({
  widgetId: "Id of the pay-link widget used to render the payment" // required
  payee: "Details of payee to create", // required or payeeId
  payerId: "Id of payer", // required or payee
  amount: "Amount in pence to authorize payment", // required
  reference: "Payee reference", // required
  expiresAt: "ISO Date-time string for pay-link expiry", // optional
  endToEndId: "Unique identifier relevant to the transaction", // optional
  useOnce: "Boolean to indicate if the pay-link can only be consumed once." // optional
});
```

#### `getPayLink`

Get a single pay-link by its id. This function uses the scope `pay_link:read`.

```javascript
const paymentData = await moneyhub.getPayLink({
  id: "Id of the pay-link"
});
```

#### `getPayLinks`

This method returns a list of created pay-links. This function uses the scope `pay_link:read`

```javascript
const payments = await moneyhub.getPayLinks({
  limit: "limit", // optional
  offset: "offset", // optional
  payeeId: "payee-id", // optional
  widgetId: "widget-id", // optional
});
```

### Standing Orders

#### `getStandingOrderAuthorizeUrl`

This is a helper function that returns an authorize url to authorize a standng order to the payee with the bank selected. This function uses the following scope with the value of the bankId provided `standing_orders:create openid id:${bankId}`. It also requires the authentication to be `client_secret_jwt` or `private_key_jwt`.

```javascript
const url = await moneyhub.getStandingOrderAuthorizeUrl({
  bankId: "Bank id to authorise payment from", // required
  payeeId: "Id of payee", // required or payee
  payee: "Details of payee to create", // required or payeeId
  payeeType: "Payee type [api-payee|mh-user-account]", // optional - defaults to api-payee
  payerId: "Id of payer", // required only if payerType is defined
  payerType: "Payer type [mh-user-account]", // required only if payerId is used
  reference: "The reference for standing order",
  frequency: {
    repeat: "The frequency to repeat the standing order [Daily,Weekly,Monthly]",
    day: "The number of the day on which to repeat the payment", // required if repeat is Weekly or Monthly
    week: "The number of the week on which to repeat the payment",
    onlyWorkDays: "Specifies whether the payment should only be made on working days",
  }
  numberOfPayments: "The number of payments to complete the standing order", // required if finalPaymentDate is not specified
  firstPaymentAmount: "Amount in pence for the first payment",
  recurringPaymentAmount: "Amount in pence for all repeating payments", // optional when it is the same as the first amount
  finalPaymentAmount: "Amount in pence for the final payment", // optional when it is the same as the first amount
  currency: "The currency code for the standing order amount [GBP]",
  firstPaymentDate: "The date to make the first payment", // should be in an international format, e.g. 15-MAR-2021 or ISO date
  recurringPaymentDate: "The date to make the first repeating payment",
  finalPaymentDate: "The date to make the final payment", // required if numberOfPayments is not specified
  state: "your state value",
  nonce: "your nonce value", // optional
  context: "Payment context [Other,BillPayment,PartyToParty]", // optional - defaults to PartyToParty
  claims: claimsObject, // optional
})

// Scope used with the bankId provided
const scope = `standing_orders:create openid id:${bankId}`

// Default claims if none are provided
const defaultClaims = {
  id_token: {
    "mh:con_id": {
      essential: true,
    },
    "mh:standing_order": {
      essential: true,
      value: {
        payeeId,
        payeeType,
        payerId,
        payerType,
        reference,
        frequency,
        numberOfPayments,
        firstPaymentAmount,
        recurringPaymentAmount,
        finalPaymentAmount,
        currency,
        firstPaymentDate,
        recurringPaymentDate,
        finalPaymentDate,
        context,
      },
    },
  },
}
```

#### `getStandingOrders`

This method returns a list of initiated standing orders. This function uses the scope `payment:read`

```javascript
const standingOrders = await moneyhub.getStandingOrders({
  limit: "limit", // optional
  offset: "offset", // optional
  userId: "user-id", // optional
  payeeId: "payee-id", // optional
  startDate: "2020-01-01", // optional
  endDate: "2020-12-31", // optional
});
```

#### `getStandingOrder`

Get a single standing order request by its id. This function uses the scope `payment:read`

```javascript
const standingOrder = await moneyhub.getStandingOrder({
  id: "standing-order-id",
});
```

### Recurring Payments (VRP)

#### `getRecurringPaymentAuthorizeUrl`

This is a helper function that returns an authorize url to authorize a recurring payment with the selected bank. This function uses the following scope with the value of the bankId provided `recurring_payment:create openid id:${bankId}`. It also requires the authentication to be `client_secret_jwt` or `private_key_jwt`.

```javascript
const url = await moneyhub.getRecurringPaymentAuthorizeUrl({
  bankId: "Bank id to authorise payment from",
  payeeId: "Id of payee", // required or payee
  payee: "Details of payee to create", // required or payeeId
  payeeType: "Payee type [api-payee|mh-user-account]", // optional - defaults to api-payee
  payerId: "Id of payer", // requird only if payerType is defined
  payerType: "Payer type [mh-user-account]", // required only if payerId is used
  reference: "The reference for recurring payment",
  validFromDate: "The date from which the authorisation is effective", // should be in an international format, e.g. 15-MAR-2021 or ISO date
  validToDate: "The date to which the authorisation is effective", // should be in an international format, e.g. 15-MAR-2021 or ISO date
  maximumIndividualAmount: "The maimum single amount that will be allowed", // the valid in whole minor units (i.e. pence)
  currency: "The currency code for the maxiumum recurring payment amount [GBP]",
  periodicLimits: [
    {
      amount: "The maximum amount for this recurring payment limit", // the valid in whole minor units (i.e. pence)
      currency: "The currency code for this recurring payment limit [GBP]",
      periodType:
        "The period over which the limit is effective [Day, Week, Fortnight, Month, Half-year, Year]",
      periodAlignment:
        "Specifies whether the period starts on the date of consent creation or lines up with a calendar [Consent, Calendar]",
    },
  ],
  type: [
    "Sweeping", // Specifies that the recurring payment is for the purpose of sweeping payments
    "Other", // Specifies that the recurring payment is for other payments of another purpose
  ],
  context: "Payment context [Other,BillPayment,PartyToParty]", // optional - defaults to PartyToParty
  state: "your state value",
  nonce: "your nonce value", // optional
  claims: claimsObject, // optional
});

// Scope used with the bankId provided
const scope = `recurring_payment:create openid id:${bankId}`;

// Default claims if none are provided
const defaultClaims = {
  id_token: {
    "mh:con_id": {
      essential: true,
    },
    "mh:recurring_payment": {
      essential: true,
      value: {
        payeeId,
        payeeType,
        payerId,
        payerType,
        reference,
        validFromDate,
        validToDate,
        maximumIndividualAmount,
        currency,
        periodicLimits,
        context,
      },
    },
  },
};
```

#### `getRecurringPayments`

This method returns a list of initiated recurring payment consents. This function uses the scope `recurring_payment:read`

```javascript
const recurringPayments = await moneyhub.getRecurringPayments({
  limit: "limit", // optional
  offset: "offset", // optional
  userId: "user-id", // optional
  payeeId: "payee-id", // optional
  startDate: "2020-01-01", // optional
  endDate: "2020-12-31", // optional
});
```

#### `getRecurringPayment`

This method gets a recurring payment consent. This function uses the scope `recurring_payment:create`

```javascript
const recurringPayment = await moneyhub.getRecurringPayment({
  recurringPaymentId: "Id of the recurring payment consent",
});
```

#### `makeRecurringPayment`

This method creates a payment using the recurring payment consent. This function uses the scope `recurring_payment:create`

```javascript
const recurringPayments = await moneyhub.getRecurringPayments({
  recurringPaymentId: "Id of the recurring payment consent",
  payment: {
    payeeId: "payee-id", // optional
    amount: 200,
    payeeRef: "Payee ref",
    payerRef: "Payer ref",
  },
});
```

#### `revokeRecurringPayment`

This method revokes a recurring payment consent. This function uses the scope `recurring_payment:create`

```javascript
const revokedRecurringPayment = await moneyhub.revokeRecurringPayment({
  recurringPaymentId: "Id of the recurring payment consent",
});
```

#### `getRegularTransactions`

Get all the regular transactions for a user, there is an option to pass an account ID as a parameter as a filter. This function uses the scope `accounts:read`, `transactions:read:all` and `regular_transactions:read`

```javascript
const queryParams = { accountID };
const regulartransactions = await moneyhub.getRegularTransactions({
  userId: "userId",
  params: queryParams,
}, options);
```

### Rental records

#### `getRentalRecords`

This method will return the rental record for the user. Requires the scope `rental_records:read`.

```javascript
const getRentalRecordResponse = await moneyhub.getRentalRecords({
  userId: "user-id",
}, options);
const rentalRecord = getRentalRecordResponse.data[0];
```

#### `createRentalRecord`

This method will create a rental record for the user. Requires the scope `rental_records:write`. Please note only one rental record can exist for a user.

```javascript
const createRentalRecordResponse = await moneyhub.createRentalRecord({
  userId: "user-id",
  rentalData: {
    title: "Title",
    firstName: "firstName",
    lastName: "lastName",
    birthdate: "2000-11-19",
    addressLine1: "First address line",
    addressLine2: "Second address line", // optional
    addressLine3: "Third address line", // optional
    addressLine4: "Fourth address line", // optional
    postalCode: "CA12345",
    tenancyStartDate: "2020-11-19",
    rentalAmount: {
      value: 10000,
    },
    rentalFrequency: "monthly",
  },
}, options);
const createdRentalRecord = createRentalRecordResponse.data;
```

#### `deleteRentalRecord`

This method deletes the rental record for a user.

```javascript
await moneyhub.deleteRentalRecord({
  userId: "user-id",
  rentalId: "rental-id",
}, options);
```

### Spending Goals

#### `createSpendingGoal`

This method will create a single spending goal for the user. Requires the scopes`spending_goals:read` and `spending_goals:write:all`.

```javascript
const spendingGoal = await moneyhub.createSpendingGoal({
  categoryId: "std:all",
  amount: { value: 200 },
  periodStart: "20",
  periodType: "monthly",
  userId: "user-id",
}, options);
```

#### `getSpendingGoals`

This method will return the spending goals for the user. Requires the scope `spending_goals:read`.

```javascript
const spendingGoals = await moneyhub.getSpendingGoals({
  userId: "user-id",
  limit: 1,
  offset: 0,
}, options);
const spendingGoal = spendingGoals.data[0];
```

#### `getSpendingGoal`

This method will return the specified spending goal for the user. Requires the scope `spending_goals:read`.

```javascript
const spendingGoals = await moneyhub.getSpendingGoal({
  userId: "user-id",
  goalId: "goal-id",
}, options);
```

#### `updateSpendingGoal`

This method will update the specified spending goal for the user. Requires the scopes `spending_goals:read` and `spending_goals:write`.

```javascript
const spendingGoals = await moneyhub.updateSpendingGoal({
  userId: "user-id",
  goalId: "goal-id",
  categoryId: "id",
  amount: { value: 302 },
}, options);
```

#### `deleteSpendingGoal`

This method will delete the specified spending goal for the user. Requires the scope `spending_goals:write:all`.

```javascript
const spendingGoals = await moneyhub.deleteSpendingGoal({
  userId: "user-id",
  goalId: "goal-id",
}, options);
```

### Savings Goals

#### `createSavingsGoal`

This method will create a single savings goal for the user. Requires the scopes`savings_goals:read` and `savings_goals:write:all`.

```javascript
const savingsGoal = await moneyhub.createSavingsGoal({
  name: "savings",
  amount: { value: 200 },
  imageUrl: "https://myimage.com",
  notes: "lots'o'money",
  userId: "user-id",
  accounts: [{ id: "1234" }],
}, options);
```

#### `getSavingsGoals`

This method will return the savings goals for the user. Requires the scope `savings_goals:read`.

```javascript
const savingsGoals = await moneyhub.getSavingsGoals({
  userId: "user-id",
  limit: 1,
  offset: 0,
}, options);
const savingsGoal = savingsGoals.data[0];
```

#### `getSavingsGoal`

This method will return the specified savings goal for the user. Requires the scope `savings_goals:read`.

```javascript
const savingsGoals = await moneyhub.getSavingsGoal({
  userId: "user-id",
  goalId: "goal-id",
}, options);
```

#### `updateSavingsGoal`

This method will update the specified savings goal for the user. Requires the scopes `savings_goals:read` and `savings_goals:write`.

```javascript
const savingsGoals = await moneyhub.updateSavingsGoal({
  userId: "user-id",
  goalId: "goal-id",
  name: "new-name",
  amount: { value: 302 },
  accounts: [{ id: "1234" }],
}, options);
```

#### `deleteSavingsGoal`

This method will delete the specified savings goal for the user. Requires the scope `savings_goals:write:all`.

```javascript
const savingsGoals = await moneyhub.deleteSavingsGoal({
  userId: "user-id",
  goalId: "goal-id",
}, options);
```

### Financial Connections

#### `listConnections`

This method will resolve with a list of all the available connections (banks, etc.) that a user can connect to.

```javascript
const availableConnections = await moneyhub.listConnections();
```

#### `listAPIConnections`

This method will resolve with a list of all the API connections that a user can connect to.

```javascript
const availableConnections = await moneyhub.listAPIConnections();
```

#### `listTestConnections`

This method will resolve with a list of all the Test connections that a user can connect to.

```javascript
const availableConnections = await moneyhub.listTestConnections();
```

#### `listBetaConnections`

This method will resolve with a list of all the Beta connections that a user can connect to.

```javascript
const availableConnections = await moneyhub.listBetaConnections();
```

#### `listPaymentsConnections`

This method will resolve with a list of all the payments connections that a user can connect to.

```javascript
const availableConnections = await moneyhub.listPaymentsConnections();
```

### OpenID Config

#### `getOpenIdConfig`

This method will resolve with our open id configuration.

```javascript
const availableConnections = await moneyhub.getOpenIdConfig();
```

### Examples

We have a couple of examples under the `/examples` folder that can be helpful to start using our client. To run them, you'll need to use `ts-node`. If you haven't got it globally installed, you can run examples by executing within the library `npm run ts-node -- <script path here> <options>`

### Running Tests

Instructions on how to run the integration tests for the API client can be found [here](https://www.notion.so/moneyhub/Moneyhub-API-Client-Tests-Config-0bef6e3cb922425b88f0268c1a999917)

### Adding Tests

The tests use root level Mocha hooks to set up and teardown test data. When adding tests please consider the following:
- The test data IDs is passed via Mocha context to the individual tests. The test data can be found in the `this.config` object
- To access the context in tests before or after hook ensure you are declaring as regular function instead of arrow function
- The context cannot be accessed in the `describe` functions, only in the hooks or tests themselves
- Any new tests added should either try to use the test data setup at beginning of the run
- If the read only test user has to be used to create data, the test itself should clear up anything created in the after hook
- Currently the read only test user is used for getting counterparties, holdings, rental records and regular transactions

### Troubleshooting tests

- If any errors occurr during test setup or teardown, this should appear as happening in the "before all" or "after all" hook in `"{root}"` with the error.
- Errors in the `before all` hook can cause errors in the `after all` hook as it won't be able to find data to clear up.

## TypeScript
If you wish to use the client library with TypeScript, we allow you to make use of the types that are returned from our methods. Below is an example usage to get started:

```ts
import {Moneyhub, ApiClientConfig} from "@mft/moneyhub-api-client"
const config: ApiClientConfig = {} // your config goes here and is strongly typed

const getAccounts = ({userId}) => {
  const moneyhub = await Moneyhub(config)
  const accounts = await moneyhub.getAccounts({ userId })
}
```

The default export is of the Moneyhub constructor that takes in an argument of the config. You can use `ApiClientConfig` to type that config. The client object that is returned from the constructor can then be used to make API calls. The methods are available with arguments and returns typed.
