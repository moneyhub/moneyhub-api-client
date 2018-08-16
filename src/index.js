const { Issuer } = require("openid-client")
const jose = require("node-jose")
const Swagger = require("swagger-client")
const got = require("got")
const R = require("ramda")
const uuid = require("uuid")

module.exports = async ({
  resourceServerUrl,
  identityServiceUrl,
  client: { client_id, client_secret, id_token_signing_alg, redirect_uri },
}) => {
  const moneyhubIssuer = await Issuer.discover(identityServiceUrl)
  // const keystore = await jose.JWK.asKeyStore({ keys: jwks })

  console.log(client_secret)

  const client = new moneyhubIssuer.Client({
    client_id,
    client_secret,
    id_token_signing_alg,
    redirect_uri,
  })

  // const {
  //   client: { apis },
  // } = await Swagger({ url: resourceServerUrl })

  const moneyhub = {
    getAuthorizeUrl: ({ state, nonce, scope, claims }) => {
      const authParams = {
        client_id: client_id,
        scope,
        state,
        nonce,
        redirect_uri: redirect_uri,
        response_type: "code",
        prompt: "consent",
      }

      return client
        .requestObject({
          ...authParams,
          claims,
          max_age: 86400,
        })
        .then(request => ({
          ...authParams,
          request,
        }))
        .then(client.authorizationUrl.bind(client))
    },
    getAuthorizeUrlForCreatedUser: async ({ bankId, state, userId }) => {
      const scope = `id:${bankId} openid`
      const nonce = uuid.v4()
      const claims = {
        id_token: {
          sub: {
            essential: true,
            value: userId,
          },
        },
      }

      const url = await moneyhub.getAuthorizeUrl({
        state,
        nonce,
        scope,
        claims,
      })
      return { url, nonce, state }
    },
    exchangeCodeForTokens: params => {},
    refreshTokens: refreshToken => {},
    getClientCredentialTokens: ({ scope, sub }) =>
      client.grant({
        grant_type: "client_credentials",
        scope,
        sub,
      }),
    registerUserWithToken: (id, token) =>
      got
        .post(identityServiceUrl.replace("oidc", "users"), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          json: true,
          body: { clientUserId: id },
        })
        .then(R.prop("body")),
    registerUser: async id => {
      const { access_token } = await moneyhub.getClientCredentialTokens({
        scope: "user:create",
      })
      return moneyhub.registerUserWithToken(id, access_token)
    },
    getUsers: async () => {
      const { access_token } = await moneyhub.getClientCredentialTokens({
        scope: "user:read",
      })
      return got(identityServiceUrl.replace("oidc", "users"), {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        json: true,
      }).then(R.prop("body"))
    },
    getUser: async id => {
      const { access_token } = await moneyhub.getClientCredentialTokens({
        scope: "user:read",
      })
      return got(identityServiceUrl.replace("oidc", `users/${id}`), {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        json: true,
      }).then(R.prop("body"))
    },
    listConnections: () =>
      got(
        "http://identity.dev.127.0.0.1.nip.io/oidc/.well-known/all-connections",
        { json: true }
      ),
    getOpenIdConfig: () =>
      got(identityServiceUrl + "/.well-known/openid-configuration", {
        json: true,
      }),
  }
  return moneyhub
}
