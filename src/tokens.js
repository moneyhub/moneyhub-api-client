const R = require("ramda")
const exchangeCodeForTokensFactory = require("./exchange-code-for-token")
const filterUndefined = R.reject(R.isNil)

const exchangeCodeForTokensErrorMessage = `
Missing Parameters in exchangeCodeForTokens method.

The signature for this method changed in v3.
The previous function is available at 'exchangeCodeForTokensLegacy'

This function now requires an object with the following properties:

{
  paramsFromCallback: {
    An object with all the params received at your redirect uri.
    The following properties are allowed:
      "code",
      "error",
      "error_description",
      "error_uri",
      "id_token",
      "state",
      "session_state",
  },
  localParams: {
    An object with params that you have in the local session for the user.
    The following properties are supported:
      "state", // required
      "nonce", // required when using 'code id_token'
      "sub", // optional, but without this param, requests where there are missing cookies will fail
      "max_age", // optional
      "response_type" // recommended
      "code_verifier" // required for PKCE
  }
}
`

module.exports = ({client, config}) => {
  const {
    client: {redirect_uri},
  } = config

  const exchangeCodeForTokens = exchangeCodeForTokensFactory({
    client,
    redirectUri: redirect_uri,
  })

  return {
    exchangeCodeForTokensLegacy: ({state, code, nonce, id_token}) => {
      const verify = filterUndefined({state, nonce})
      const requestObj = filterUndefined({state, code, id_token, nonce})
      return client.authorizationCallback(redirect_uri, requestObj, verify)
    },

    exchangeCodeForTokens: ({paramsFromCallback, localParams}) => {
      if (!paramsFromCallback || !localParams) {
        console.error(exchangeCodeForTokensErrorMessage)
        throw new Error("Missing parameters")
      }
      return exchangeCodeForTokens({paramsFromCallback, localParams})
    },

    refreshTokens: ({refreshToken}) => client.refresh(refreshToken),

    getClientCredentialTokens: ({scope, sub}) =>
      client.grant({
        grant_type: "client_credentials",
        scope,
        sub,
      }),
  }
}
