# Moneyhub API Client

### Introduction

This is an Node.JS client for the Moneyhub API. It currently supports the following features:

- Getting the list of supported banks
- Registering users
- Generating authorisation urls for new and existing users
- Getting access tokens and refresh tokens from an authorisation code
- Refreshing access tokens
- Getting access tokens with client credentials
- Getting accounts for a user
- Getting transactions for a user

Currently this library supports `client_secret_basic` authentication, shortly we will add support for `client_secret_jwt` and `private_key_jwt`

### Prerequisites

To use this API client you will need:

- A `client_id`, `client_secret` and `redirect_uri` of a registered API client
- The url of the Moneyhub identity service for the environment you are connecting to
- The url for the API gateway for the environment that you are connecting to

### Usage

This module exposes a single factory function that accepts the following configuration:

```javascript
const Moneyhub = require("@mft/moenyhub-api-cient")
const moneyhub = Moneyhub({
  resourceServerUrl: "https://api.moneyhub.co.uk/v2.0",
  identityServiceUrl: "https://identity.moneyhub.co.uk/oidc",
  client: {
    client_id: "your client id",
    client_secret: "your client secret",
    token_endpoint_auth_method: "client_secret_basic",
    id_token_signing_alg: "RS256",
    redirect_uri: "https://your-redirect-uri",
  },
})
```

Once the api client has been initialised it provides a simple promise based interface with the following methods:

#### `getAuthorizeUrl`

This method returns an authorize url for your API client. You can redirect a user to this url, after which they will be redirected back to your `redirect_uri`.

Example:

```javascript
const url = await moneyhub.getAuthorizeUrl({
  state: " your state value",
  scope: "openid other-scope-values",
  claims: claimsObject,
})
```

#### `getAuthorizeUrlForCreatedUser`

This is a helper function that returns an authorize url for a specific user to connect to a specific bank.

Example:

```javascript
const url = await moneyhub.getAuthorizeUrlForCreatedUser({
  bankId: "the bank id to connect to",
  state: "your state value",
  userId: "the user id retruned from the registerUser call",
})
```

#### `exchangeCodeForTokens`

After a user has succesfully authorised they will be redirected to your redirect_uri with an authorization code. You can use this to retrieve access, refresh and id tokens for the user.

```javascript
const tokens = await moneyhub.exchangeCodeForTokens({
  state: "your state value",
  code: "the authorization code",
})
```

### `getClientCredentialTokens`

Use this to get a client credentials access token.

```javascript
const tokens = await moneyhub.getClientCredentialTokens({
  scope: "the-required-scope",
  sub: "the user id", // optional
})
```

### `registerUserWithToken`

Use this to register a new user

```javascript
const user = await moneyhub.registerUserWithToken({
  id: "your user id" //optional ,
  token: "an access token with the user:crate scope",
})
```

### `registerUser`

Helper method that gets the correct client credentials access token and then registers a user.

```javascript
const user = await moneyhub.registerUser("your user id" /* optional */)
```

### `getUsers`

Returns all the users registered for your api-client

```javascript
const users = await moneyhub.getUsers()
```

### `getUser`

Get a single user by their id

```javascript
const user = await moneyhub.getUser(userId)
```

### `getAccounts`

Get all accounts for a user. This call requires an access token with the `accounts:read` scope.

```javascript
const accounts = await moneyhub.getAccounts(token)
```

### `getTransactions`

Get all transactions for a user. This call requires an access token with a scope that allows it to read transactions.

```javascript
const accounts = await moneyhub.getAccounts(token)
```

### `listConnections`

This method will resolve with a list of all the avaialble connections (banks, etc.) that a user can connect to.

```javascript
const availableConnections = await moneyhub.listConnections()
```
