# Moneyhub API Client

### Introduction

This is an Node.JS client for the [Moneyhub API](https://moneyhub.github.io/api-docs). It currently supports the following features:

- Getting the list of supported banks
- Registering users
- Deleting users
- Generating authorisation urls for new and existing users
- Getting access tokens and refresh tokens from an authorisation code
- Refreshing access tokens
- Deleting user connections
- Getting access tokens with client credentials
- Getting accounts for a user
- Getting transactions for a user
- Generate authorisation url for payments
- Add Payees
- Get Payees and payments

Currently this library supports `client_secret_basic`, `client_secret_jwt` and `private_key_jwt` authentication.

### Prerequisites

To use this API client you will need:

- A `client_id`, `client_secret` and `redirect_uri` of a registered API client
- The url of the Moneyhub identity service for the environment you are connecting to (https://identity.moneyhub.co.uk/oidc)
- The url for the API gateway for the environment that you are connecting to (https://api.moneyhub.co.uk/v2.0)

### To install

`npm install @mft/moneyhub-api-client`

### Usage

This module exposes a single factory function that accepts the following configuration:

```javascript
const Moneyhub = require("@mft/moneyhub-api-client")
const moneyhub = Moneyhub({
  resourceServerUrl: "https://api.moneyhub.co.uk/v2.0",
  identityServiceUrl: "https://identity.moneyhub.co.uk/oidc",
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

Once the api client has been initialised it provides a simple promise based interface with the following methods:

### JWKS

#### `createJWKS`

This method creates a JWKS that can be used when configuring your Moneyhub API client. The public keys should be used in the configuration
of the API client in the Moneyhub Admin portal. The private keys should
be used in the config when creating an instance of this client.

```javascript
const url = await moneyhub.createJWKS({
  keyAlg, // default 'RSA'
  keySize, // default 2048
  keyUse, // default 'sig'
  alg, // default 'RS256'
})
```

### Auth API

#### `getAuthorizeUrl`

This method returns an authorize url for your API client. You can redirect a user to this url, after which they will be redirected back to your `redirect_uri`.

[Data access scopes](https://moneyhub.github.io/api-docs/#data-access)

[Financial institution scopes](https://moneyhub.github.io/api-docs/#financial-institutions)

[Bank ids](https://moneyhub.github.io/api-docs/#bank-connections)

```javascript
const url = await moneyhub.getAuthorizeUrl({
  scope: "openid bank-id-scope other-data-scopes",
  state: " your state value", // optional
  nonce: "your nonce value", //optional
  claims: claimsObject, // optional
})

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
}
```

#### `getAuthorizeUrlForCreatedUser`

This is a helper function that returns an authorize url for a specific user to connect to a specific bank. This function uses the following scope with the value of the bankId provided `id:${bankId} openid`.

[Bank ids](https://moneyhub.github.io/api-docs/#bank-connections)

```javascript
const url = await moneyhub.getAuthorizeUrlForCreatedUser({
  bankId: "bank id to connect to",
  userId: "user id returned from the registerUser call",
  state: "your state value", // optional
  nonce: "your nonce value", // optional
  claims: claimsObject, // optional
})

// Scope used with the bankId provided
const scope = `id:${bankId} openid`

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
}
```

#### `getReauthAuthorizeUrlForCreatedUser`

This is a helper function that returns an authorize url for a specific user to re authorize and existing connection. This function uses the scope `openid reauth`.

```javascript
const url = await moneyhub.getReauthAuthorizeUrlForCreatedUser({
  userId: "the user id",
  connectionId: "connection Id to re authorize",
  state: "your state value", // optional
  nonce: "your nonce value", // optional
  claims: claimsObject, // optional
})

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
}
```

#### `getRefreshAuthorizeUrlForCreatedUser`

This is a helper function that returns an authorize url for a specific user to refresh and existing connection. This function uses the scope `openid refresh`. (Only relevant for legacy connections)

```javascript
const url = await moneyhub.getRefreshAuthorizeUrlForCreatedUser({
  userId: "the user id",
  connectionId: "connection Id to re refresh",
  state: "your state value", // optional
  nonce: "your nonce value", // optional
  claims: claimsObject, // optional
})

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
}
```

#### `exchangeCodeForTokens`

After a user has succesfully authorised they will be redirected to your redirect_uri with an authorization code. You can use this to retrieve access, refresh and id tokens for the user.

```javascript
const tokens = await moneyhub.exchangeCodeForTokens({
  code: "the authorization code",
  nonce: "your nonce value", // optional
  state: "your state value", // optional
  id_token: "your id token", // optional
})
```

#### `getClientCredentialTokens`

Use this to get a client credentials access token.

```javascript
const tokens = await moneyhub.getClientCredentialTokens({
  scope: "the-required-scope",
  sub: "the user id", // optional
})
```

### User Management

#### `registerUser`

Helper method that gets the correct client credentials access token and then registers a user.

```javascript
const user = await moneyhub.registerUser("your user id" /* optional */)
```

#### `getUsers`

Returns all the users registered for your api-client

```javascript
const users = await moneyhub.getUsers({limit, offset, isDemo})
```

#### `getUser`

Get a single user by their id

```javascript
const user = await moneyhub.getUser("user-id")
```

#### `deleteUser`

Helper method that gets the correct client credentials access token and then deletes a user.

```javascript
const user = await moneyhub.deleteUser("user-id")
```

#### `registerUserWithToken`

Use this to register a new user

```javascript
const user = await moneyhub.registerUserWithToken(
  "your user id", //optional ,
  "an access token with the user:create scope"
)
```

#### `deleteUserWithToken`

Deletes a user. This calls requires an access token with the `user:delete` scope.

```javascript
const user = await moneyhub.deleteUserWithToken("user-id", "access.token")
```

### User Connections

#### `getUserConnections`

Helper method that gets the correct client credentials access token and then gets all user connections.

```javascript
const user = await moneyhub.getUserConnections("user-id")
```

#### `deleteUserConnection`

Helper method that gets the correct client credentials access token and then deletes a user connection.

```javascript
const user = await moneyhub.deleteUserConnection("user-id", "connection-id")
```

#### `deleteUserConnectionWithToken`

Deletes a user connection. This calls requires an access token with the `user:delete` scope

```javascript
const user = await moneyhub.deleteUserConnectionWithToken(
  "user-id",
  "connection-id",
  "access.token"
)
```

### Data API

#### `getAccounts`

Get all accounts for a user. This function uses the scope `accounts:read`.

```javascript
const queryParams = {limit: 10, offset: 5}
const accounts = await moneyhub.getAccounts("userId", queryParams)
```

#### `getAccountsWithToken`

Get all accounts for a user. This call requires an access token with the `accounts:read` scope.

```javascript
const accounts = await moneyhub.getAccountsWithToken("access.token")
```

### `getAccount`

Get a single account for a user by the accountId. This function uses the scope `accounts:read`.

```javascript
const account = await moneyhub.getAccount("userId", "accountId")
```

#### `getAccountHoldingsWithToken`

Get account holdings for a user. This call requires an access token with the `accounts:read` scope.

```javascript
const accounts = await moneyhub.getAccountHoldingsWithToken("access.token", "accountId)
```

### `getAccountHoldings`

Get account holdings for a user. This function uses the scope `accounts:read`.

```javascript
const account = await moneyhub.getAccountHoldings("userId", "accountId")
```

### `getAccountHoldingsWithMatches`

Get account holdings with ISIN codes matchers for a user. This function uses the scope `accounts:read`.

```javascript
const account = await moneyhub.getAccountHoldingsWithMatches("userId", "accountId")
```

#### `getTransactions`

Get all transactions for a user. This function uses the scope `transactions:read:all`..

```javascript
const queryParams = {limit: 10, offset: 5}
const accounts = await moneyhub.getTransactions("userId", queryParams)
```

#### `getTransactionsWithToken`

Get all transactions for a user. This call requires an access token with a scope that allows it to read transactions.

```javascript
const accounts = await moneyhub.getTransactionsWithToken("access.token")
```

### Payments

#### `getPaymentAuthorizeUrl`

This is a helper function that returns an authorize url to authorize a payment to the payee with the bank selected. This function uses the following scope with the value of the bankId provided `payment openid id:${bankId}`. It also requires the authentication to be `client_secret_jwt` or `private_key_jwt`.

```javascript
const url = await moneyhub.getPaymentAuthorizeUrl({
  bankId: "Bank id to authorise payment from",
  payeeId: "Id of payee previously added"
  amount: "Amount in pence to authorize payment"
  payeeRef: "Payee reference",
  payerRef: "Payer reference",
  state: "your state value", // optional
  nonce: "your nonce value", // optional
  claims: claimsObject, // optional
})

// Scope used with the bankId provided
const scope = `payment openid id:${bankId}`

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
      },
    },
  },
}
```

#### `addPayee`

This method will add a Payee. This will return an id that it is
required to be used as `payeeId` when initiating a payment. This function uses the scope `payee:create`

```javascript
const tokens = await moneyhub.addPayee({
  accountNumber: "your account number",
  sortCode: "your sort code",
  name: "name of Payee",
})
```

#### `getPayees`

This method returns a list of registered payees. This function uses the scope `payee:read`

```javascript
const tokens = await moneyhub.getPayees({
  limit: "limit", // optional
  offset: "offset", // optional
})
```

#### `getPayments`

This method returns a list of initiated payments. This function uses the scope `payment:read`

```javascript
const tokens = await moneyhub.getPayments({
  limit: "limit", // optional
  offset: "offset", // optional
})
```

#### `getPayment`

Get a single payment by its id . This function uses the scope `payment:read`

```javascript
const tokens = await moneyhub.getPayment("payment-id")
```

### Financial Connections

#### `listConnections`

This method will resolve with a list of all the available connections (banks, etc.) that a user can connect to.

```javascript
const availableConnections = await moneyhub.listConnections()
```

#### `listAPIConnections`

This method will resolve with a list of all the API connections that a user can connect to.

```javascript
const availableConnections = await moneyhub.listAPIConnections()
```

#### `listTestConnections`

This method will resolve with a list of all the Test connections that a user can connect to.

```javascript
const availableConnections = await moneyhub.listTestConnections()
```

### OpenID Config

#### `getOpenIdConfig`

This method will resolve with our open id configuration.

```javascript
const availableConnections = await moneyhub.getOpenIdConfig()
```

### Examples

We have a couple of examples under the `/examples` folder that can be helpful to start using our client.
