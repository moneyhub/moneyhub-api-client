const {Issuer, custom} = require("openid-client")
const R = require("ramda")
const {JWKS} = require("jose")
const getAuthUrlsFactory = require("./get-auth-urls")
const getTokensFactory = require("./tokens")
const requestFactories = [
  require("./requests/accounts"),
  require("./requests/auth-requests"),
  require("./requests/payees"),
  require("./requests/payments"),
  require("./requests/projects"),
  require("./requests/sync"),
  require("./requests/tax"),
  require("./requests/transactions"),
  require("./requests/transaction-files"),
  require("./requests//transaction-splits"),
  require("./requests/unauthenticated"),
  require("./requests/users-and-connections"),
  require("./requests/categories")
]
const DEFAULT_TIMEOUT = 60000

module.exports = async (apiClientConfig) => {
  const config = R.evolve(
    {
      identityServiceUrl: (value) => value.replace("/oidc", ""),
    },
    apiClientConfig
  )

  const {
    identityServiceUrl,
    options = {},
    client: {
      client_id,
      client_secret,
      id_token_signed_response_alg,
      request_object_signing_alg,
      redirect_uri,
      keys,
      token_endpoint_auth_method,
    },
  } = config

  const {timeout = DEFAULT_TIMEOUT} = options

  custom.setHttpOptionsDefaults({
    timeout,
  })

  Issuer.defaultHttpOptions = {timeout}

  const moneyhubIssuer = await Issuer.discover(identityServiceUrl + "/oidc")

  const client = new moneyhubIssuer.Client(
    {
      client_id,
      client_secret,
      id_token_signed_response_alg,
      redirect_uri,
      token_endpoint_auth_method,
      request_object_signing_alg,
    },
    {keys}
  )

  client[custom.clock_tolerance] = 10

  const request = require("./request")({client, options: {timeout}})

  const moneyhub = {
    ...R.mergeAll(requestFactories.map((fn) => fn({request, config}))),
    ...getAuthUrlsFactory({client, config}),
    ...getTokensFactory({client, config}),

    keys: () => (keys && keys.length ? JWKS.asKeyStore({keys}).toJWKS() : null),
  }
  return moneyhub
}
