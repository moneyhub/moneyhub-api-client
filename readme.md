# Moneyhub API Client

### Introduction

This is an Node.JS client for the [Moneyhub API](https://www.notion.so/Moneyhub-API-Docs-26fa35dba2a64cf08116cbd6fe844488). It currently supports the following features:

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
- CRUD actions on projects
- CRUD actions on transaction attachments
- Get a tax return for a subset of transactions

Currently this library supports `client_secret_basic`, `client_secret_jwt` and `private_key_jwt` authentication.

### Prerequisites

To use this API client you will need:

- A `client_id`, `client_secret` and `redirect_uri` of a registered API client
- The url of the Moneyhub identity service for the environment you are connecting to (https://identity.moneyhub.co.uk)
- The url for the API gateway for the environment that you are connecting to (https://api.moneyhub.co.uk/v2.0)

### To install

`npm install @mft/moneyhub-api-client`

### Usage

This module exposes a single factory function that accepts the following configuration:

```javascript
const Moneyhub = require("@mft/moneyhub-api-client")
const moneyhub = Moneyhub({
  resourceServerUrl: "https://api.moneyhub.co.uk/v2.0",
  identityServiceUrl: "https://identity.moneyhub.co.uk",
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

### Auth API

#### `getAuthorizeUrl`

This method returns an authorize url for your API client. You can redirect a user to this url, after which they will be redirected back to your `redirect_uri`.

[Scopes](https://www.notion.so/moneyhub/Scopes-ca431010f9fa4398bb4b64c6a00beb98)

[Financial institution](https://www.notion.so/moneyhub/Bank-Connections-a2a0177ea8d44131a00f8b8ed18de69d)

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

[Scopes](https://www.notion.so/moneyhub/Scopes-ca431010f9fa4398bb4b64c6a00beb98)

[Financial institution](https://www.notion.so/moneyhub/Bank-Connections-a2a0177ea8d44131a00f8b8ed18de69d)gs

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

#### `exchangeCodeForTokensLegacy`

This is a legacy method to get tokens for a user.
After a user has succesfully authorised they will be redirected to your redirect_uri with an authorization code. You can use this to retrieve access, refresh and id tokens for the user.

```javascript
const tokens = await moneyhub.exchangeCodeForTokens({
  code: "the authorization code",
  nonce: "your nonce value", // optional
  state: "your state value", // optional
  id_token: "your id token", // optional
})
```

#### `exchangeCodeForTokens`

After a user has succesfully authorised they will be redirected to your redirect_uri with an authorization code. You can use this method to retrieve access, refresh and id tokens for the user.

The signature for this method changed in v3.
The previous function is available at 'exchangeCodeForTokensLegacy'

This method requires an object with two properties:
 - `paramsFromCallback` :  an object with all the params received at your redirect uri
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
})
```

#### `refreshTokens`

Use this to get a new access token using a refresh token

```javascript
const tokens = await moneyhub.refreshTokens({
  refreshToken: "refresh-token",
})
```

### Auth Request URI

#### `requestObject`

Creates a request object

```javascript
const tokens = await moneyhub.requestObject({
  scope: "the-required-scope",
  state: "state",
  nonce: "nonce,
  claims: claimsObject,
})
```

#### `getRequestUri`

Use this to create a request uri from a request object

```javascript
const tokens = await moneyhub.getRequestUri(
  requestObject
)
```

#### `getAuthorizeUrlFromRequestUri`

Use this to retrieve an authorization url from a request uri

```javascript
const tokens = await moneyhub.getAuthorizeUrlFromRequestUri({
  requestUri: "request-uri"
})
```

### Auth Requests

#### `createAuthRequest`

Creates an auth request

```javascript
const tokens = await moneyhub.createAuthRequest({
  redirectUri: "redirect-uri,
  userId: "user-id",
  connectionId: "connection-id",
  categorisationType: "personal",
  scope:"openid payment",
  payment: paymentObject, //optional
})
```

#### `completeAuthRequest`

Completes an auth request

```javascript
const tokens = await moneyhub.completeAuthRequest({
  id: "auth-request-id",
  authParams: {
    code: "code"
    state: "state",
    "id_token": "idToken",
    error: "error-code",
    "error_description": "error description"
  }
})
```

#### `getAllAuthRequests`

Retrieves auth requests

```javascript
const tokens = await moneyhub.getAllAuthRequests({
  limit: 10, // optional
  offset: 0 // optional
})
```

#### `getAuthRequest`

Retrieve a single auth request

```javascript
const tokens = await moneyhub.getAuthRequest({
  id: "auth-request-id"
})
```

### User Management

#### `registerUser`

Helper method that gets the correct client credentials access token and then registers a user.

```javascript
const user = await moneyhub.registerUser({
  clientUserId: "your user id" /* optional */
})
```

#### `getUsers`

Returns all the users registered for your api-client

```javascript
const users = await moneyhub.getUsers({
  limit,
  offset,
  isDemo
  })
```

#### `getUser`

Get a single user by their id

```javascript
const user = await moneyhub.getUser({
  userId: "user-id"
  })
```

#### `deleteUser`

Helper method that gets the correct client credentials access token and then deletes a user.

```javascript
const user = await moneyhub.deleteUser({
  userId: "user-id"}
  )
```


### User Connections

#### `getUserConnections`

Helper method that gets the correct client credentials access token and then gets all user connections.

```javascript
const user = await moneyhub.getUserConnections({
  userId: "user-id"
  })
```

#### `syncUserConnection`

Sync an existing user connection. This process will fetch the latest balances and transactions of the accounts attached to the connection. This method only returns the status of the syncing.

```javascript
const tokens = await moneyhub.syncUserConnection({
  userId,
  connectionId,
  customerIpAddress, // optional
  customerLastLoggedTime, // optional
})
```

#### `deleteUserConnection`

Helper method that gets the correct client credentials access token and then deletes a user connection.

```javascript
const user = await moneyhub.deleteUserConnection({
  userId: "user-id",
  connectionId: "connection-id"
  })
```

### Data API

#### `getAccounts`

Get all accounts for a user. This function uses the scope `accounts:read`.

```javascript
const queryParams = {limit: 10, offset: 5}
const accounts = await moneyhub.getAccounts({
  userId: "userId",
  params: queryParams,
  })
```

#### `getAccountsWithDetails`

Get all accounts for a user including extra details (sort code, account number, account holder name). This function uses the scopes `accounts:read accounts_details:read`.

```javascript
const queryParams = {limit: 10, offset: 5}
const accounts = await moneyhub.getAccountsWithDetails({
  userId: "userId",
  params: queryParams
  })
```

#### `getAccount`

Get a single account for a user by the accountId. This function uses the scope `accounts:read`.

```javascript
const account = await moneyhub.getAccount({
  userId: "userId",
  accountId: "accountId"
  })
```

#### `getAccountWithDetails`

Get a single account for a user by the accountId including extra details (sort code, account number, account holder name). This function uses the scope `accounts:read accounts_details:read`.

```javascript
const account = await moneyhub.getAccountWithDetails({
  userId: "userId",
  accountId: "accountId"
  })
  ```


#### `getAccountHoldings`

Get account holdings for a user. This function uses the scope `accounts:read`.

```javascript
const account = await moneyhub.getAccountHoldings({
  userId: "userId",
  accountId: "accountId"
  })
```

#### `getAccountHoldingsWithMatches`

Get account holdings with ISIN codes matchers for a user. This function uses the scope `accounts:read`.

```javascript
const account = await moneyhub.getAccountHoldingsWithMatches({
  userId: "userId",
  accountId: "accountId"
  })
```

#### `getAccountHolding`

Get a single holding from a user's account. This function uses the scope `accounts:read`.

```javascript
const account = await moneyhub.getAccountHolding({
  userId: "userId",
  accountId: "accountId",
  holdingId: "holdingId"
  })
```

#### `getAccountCounterparties`

Get account counterparties for a user. This function uses the scope `accounts:read transactions:read`.

```javascript
const account = await moneyhub.getAccountCounterparties({
  userId: "userId",
  accountId: "accountId"
  })
```

#### `getAccountRecurringTransactions`

Get account recurring transactions for a user. This function uses the scope `accounts:read transactions:read`.

```javascript
const account = await moneyhub.getAccountRecurringTransactions({
  userId: "userId",
  accountId: "accountId"
  })
```

#### `getTransactions`

Get all transactions for a user. This function uses the scope `transactions:read:all`..

```javascript
const queryParams = {limit: 10, offset: 5}
const transactions = await moneyhub.getTransactions({
  userId: "userId",
  params: queryParams
  })
```

#### `addFileToTransaction`

Add an attachment to a transaction. This call requires an access token with a scope that allows it to read and write transactions. The third parameter must be a stream, and the size of the file being uploaded can be of max size 10MB.

```javascript
const file = await money.addFileToTransaction({
  userId: "userId" ,
  transactionId: "transactionId",
  fileName: "file-name",
  fileData: fs.createReadStream("path/to/file.png"),
  })
```

#### `getTransactionFiles`

Get all attachments associated with a transaction. This call requires an access token with a scope that allows it to read transactions.

```javascript
const files = await money.getTransactionFiles({
  userId: "userId" ,
  transactionId: "transactionId",
  })
```

#### `getTransactionFile`

Get an attachment associated with a transaction. This call requires an access token with a scope that allows it to read transactions.

```javascript
const files = await money.getTransactionFile({
  userId: "userId" ,
  transactionId: "transactionId",
  fileId: "fileId",
  })
```

#### `deleteTransactionFile`

Delete an attachment associated with a transaction. This call requires an access token with a scope that allows it to read and write transactions.

```javascript
await money.deleteTransactionFile({
  userId: "userId" ,
  transactionId: "transactionId",
  fileId: "fileId",
  })
```

#### `getGlobalCounterparties`

Get global counterparties.

```javascript

const accounts = await moneyhub.getGlobalCounterparties()
```


### Projects

#### `getProjects`

This method returns a list of projects. This function uses the scope `projects:read`

```javascript
const projects = await moneyhub.getProjects({x
  userId: "userId",
  params: {
    limit: "limit", // optional
    offset: "offset", // optional
  } // optional
})
```

#### `getProject`

Get a single project for a user by the projectId. This function uses the scope `projects:read`.

```javascript
const project = await moneyhub.getProject({
  userId: "userId",
  projectId: "projectId"
  })
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
  }
})
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
  }
})
```

#### `deleteProject`
Delete a project for a user given a project ID. This function uses the scope `projects.delete`.

```javascript
const result = await moneyhub.deleteProject({
  userId: "userId",
  projectId: "projectId"
  })
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
  }
})
```


### Payments

#### `getPaymentAuthorizeUrl`

This is a helper function that returns an authorize url to authorize a payment to the payee with the bank selected. This function uses the following scope with the value of the bankId provided `payment openid id:${bankId}`. It also requires the authentication to be `client_secret_jwt` or `private_key_jwt`.

```javascript
const url = await moneyhub.getPaymentAuthorizeUrl({
  bankId: "Bank id to authorise payment from",
  payeeId: "Id of payee",
  payeeType: "Payee type [api-payee|mh-user-account]", // optional - defaults to api-payee
  payerId: "Id of payer", // requird only if payerType is defined
  payerType: "Payer type [mh-user-account]", // required only if payerId is used
  amount: "Amount in pence to authorize payment",
  payeeRef: "Payee reference",
  payerRef: "Payer reference",
  payerName: "Payer Name", // optional
  payerEmail: "Payer Email", // optional
  state: "your state value",
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
        payeeType,
        payerId,
        payerType,
        payerName,
        payerEmail,
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
})
```

#### `getPayees`

This method returns a list of registered payees. This function uses the scope `payee:read`

```javascript
const payees = await moneyhub.getPayees({
  limit: "limit", // optional
  offset: "offset", // optional
})
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
})
```

#### `getPayment`

Get a single payment by its id . This function uses the scope `payment:read`

```javascript
const paymentData = await moneyhub.getPayment({
  id: "payment-id",
})
```

#### `getPaymentFromIDToken`

When a payment flow is completed and you call `exchangeCodeForTokens`
you will receive back an ID Token that contains the payment id. This is a utility function to get the payment data using the id in the ID Token.

```javascript
const paymentData = await moneyhub.getPaymentFromIDToken({
  idToken: "eyJhbGciOiJSUz..."
  })
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
