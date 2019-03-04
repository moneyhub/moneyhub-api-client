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

Currently this library supports `client_secret_basic` authentication, shortly we will add support for `client_secret_jwt` and `private_key_jwt`

### Prerequisites

To use this API client you will need:

- A `client_id`, `client_secret` and `redirect_uri` of a registered API client
- The url of the Moneyhub identity service for the environment you are connecting to
- The url for the API gateway for the environment that you are connecting to

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
    "sub": {
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
    "sub": {
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
const user = await moneyhub.registerUserWithToken(
  "your user id", //optional ,
  "an access token with the user:create scope"
)
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
const user = await moneyhub.getUser("user-id")
```

### `getAccounts`

Get all accounts for a user. This call requires an access token with the `accounts:read` scope.

```javascript
const accounts = await moneyhub.getAccounts("access.token")
```

### `getTransactions`

Get all transactions for a user. This call requires an access token with a scope that allows it to read transactions.

```javascript
const accounts = await moneyhub.getTransactions("access.token")
```

### `deleteUserConnection`

Helper method that gets the correct client credentials access token and then deletes a user connection.

```javascript
const user = await moneyhub.deleteUserConnection("user-id", "connection-id")
```

### `deleteUserConnectionWithToken`

Deletes a user connection. This calls requires an access token with the `user:delete` scope

```javascript
const user = await moneyhub.deleteUserConnectionWithToken(
  "user-id",
  "connection-id",
  "access.token"
)
```

### `deleteUser`

Helper method that gets the correct client credentials access token and then deletes a user.

```javascript
const user = await moneyhub.deleteUser("user-id")
```

### `deleteUserWithToken`

Deletes a user. This calls requires an access token with the `user:delete` scope.

```javascript
const user = await moneyhub.deleteUserWithToken("user-id", "access.token")
```

### `listConnections`

This method will resolve with a list of all the available connections (banks, etc.) that a user can connect to.

```javascript
const availableConnections = await moneyhub.listConnections()
```

### `listAPIConnections`

This method will resolve with a list of all the API connections that a user can connect to.

```javascript
const availableConnections = await moneyhub.listAPIConnections()
```

### `listTestConnections`

This method will resolve with a list of all the Test connections that a user can connect to.

```javascript
const availableConnections = await moneyhub.listTestConnections()
```

### `getOpenIdConfig`

This method will resolve with our open id configuration.

```javascript
const availableConnections = await moneyhub.getOpenIdConfig()
```

### Examples

We have a couple of examples under the `/examples` folder that can be helpful to start using our client.
