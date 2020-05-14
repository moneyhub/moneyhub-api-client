/* eslint-disable complexity */
/* eslint-disable max-statements */
const R = require("ramda")
const {TokenSet} = require("openid-client")

const ALLOWED_PARAMS = [
  "access_token",
  "code",
  "error",
  "error_description",
  "error_uri",
  "expires_in",
  "id_token",
  "state",
  "token_type",
  "session_state",
]

const RESPONSE_TYPE_REQUIRED_PARAMS = {
  code: ["code"],
  id_token: ["id_token"],
  token: ["access_token", "token_type"],
}

module.exports = ({client, redirectUri}) => ({paramsFromCallback, localParams}) => {
  const params = R.pick(ALLOWED_PARAMS, paramsFromCallback)
  const checks = localParams

  if (client.default_max_age && !checks.max_age)
    checks.max_age = client.default_max_age

  if (!params.state && checks.state) {
    return Promise.reject(new Error("paramsFromCallback.state is missing"))
  }

  if (params.state && !checks.state) {
    return Promise.reject(new Error("localParams.state argument is missing"))
  }

  if (checks.state !== params.state) {
    return Promise.reject(new Error("state mismatch"))
  }

  if (params.error) {
    return Promise.reject(new Error(params.error))
  }

  if (!params.code) {
    return Promise.reject(new Error("paramsFromCallback.code is missing"))
  }

  if (checks.response_type) {
    for (const type of checks.response_type.split(" ")) {
      // eslint-disable-line no-restricted-syntax
      if (type === "none") {
        if (params.code || params.id_token || params.access_token) {
          return Promise.reject(
            new Error("unexpected params encountered for 'none' response"),
          )
        }
      } else {
        for (const param of RESPONSE_TYPE_REQUIRED_PARAMS[type]) {
          // eslint-disable-line no-restricted-syntax, max-len
          if (!params[param]) {
            return Promise.reject(new Error(`${param} missing from response`))
          }
        }
      }
    }
  }

  let promise

  if (params.id_token) {
    promise = Promise.resolve(new TokenSet(params))
      .then((tokenset) => client.decryptIdToken(tokenset))
      .then((tokenset) =>
        client.validateIdToken(
          tokenset,
          checks.nonce,
          "authorization",
          checks.max_age,
          checks.state,
        ),
      )
  }

  if (params.code) {
    const grantCall = () =>
      client.grant({
        grant_type: "authorization_code",
        code: params.code,
        redirect_uri: redirectUri,
        code_verifier: checks.code_verifier,
        sub: localParams.sub,
      })
        .then((tokenset) => client.decryptIdToken(tokenset))
        .then((tokenset) =>
          client.validateIdToken(tokenset, checks.nonce, "token", checks.max_age),
        )
        .then((tokenset) => {
          if (params.session_state)
            tokenset.session_state = params.session_state
          return tokenset
        })

    if (promise) {
      promise = promise.then(grantCall)
    } else {
      return grantCall()
    }
  }

  return promise || Promise.resolve(new TokenSet(params))
}
