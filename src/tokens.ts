import type {Client, TokenSet} from "openid-client"
import * as R from "ramda"
import * as jose from "jose"
import type {ApiClientConfig} from "./schema/config"
import type {JWK, KeyLike} from "jose"
import * as crypto from "crypto"
import exchangeCodeForTokensFactory from "./exchange-code-for-token"

const random = (length = 32) =>
  jose.base64url.encode(crypto.randomBytes(length))

const createSignedJWT = async ({
  alg,
  kid,
  audience,
  issuer,
  sub,
  privateKey,
  expirationTime = "10m",
}: {
    alg: string
    kid: string | undefined
    audience: string
    issuer: string
    sub: string
    privateKey: KeyLike | Uint8Array
    expirationTime: string | undefined
  }) =>
  new jose.SignJWT({})
    .setProtectedHeader({alg, kid})
    .setSubject(sub)
    .setAudience(audience)
    .setIssuer(issuer)
    .setJti(random())
    .setIssuedAt()
    .setExpirationTime(expirationTime)
    .sign(privateKey)


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

export default ({
  client,
  config,
}: {
  client: Client
  config: ApiClientConfig
}) => {
  const {
    identityServiceUrl,
    client: {redirect_uri, request_object_signing_alg, keys, client_id},
  } = config

  const exchangeCodeForTokens = exchangeCodeForTokensFactory({
    client,
    redirectUri: redirect_uri,
  })

  const createJWTBearerGrantToken = async (sub: string) => {
    if (request_object_signing_alg === "none") throw new Error("request_object_signing_alg can't be 'none'")

    const privateJWK =  keys.find(({alg}) => alg === request_object_signing_alg) as JWK
    if (!privateJWK) throw new Error(`Private key with alg ${request_object_signing_alg} missing`)

    const privateKey = await jose.importJWK(privateJWK)

    return await createSignedJWT({
      alg: request_object_signing_alg,
      kid: privateJWK.kid,
      sub,
      audience: `${identityServiceUrl}/oidc`,
      issuer: client_id,
      privateKey,
      expirationTime: "10m",
    })
  }

  return {
    exchangeCodeForTokensLegacy: ({
      state,
      code,
      nonce,
      id_token,
    }: {
      state: string
      code: string
      nonce: string
      id_token?: string
    }): Promise<TokenSet> => {
      const verify = filterUndefined({state, nonce})
      const requestObj = filterUndefined({state, code, id_token, nonce})
      return (client as any).authorizationCallback(redirect_uri, requestObj, verify)
    },

    exchangeCodeForTokens: ({paramsFromCallback, localParams}: Parameters<typeof exchangeCodeForTokens>[0]) => {
      if (!paramsFromCallback || !localParams) {
        console.error(exchangeCodeForTokensErrorMessage)
        throw new Error("Missing parameters")
      }
      return exchangeCodeForTokens({paramsFromCallback, localParams})
    },

    refreshTokens: ({refreshToken}: {refreshToken: string | TokenSet}) => client.refresh(refreshToken),

    getClientCredentialTokens: ({scope, sub}: {scope: string, sub?: string}) =>
      client.grant({
        grant_type: "client_credentials",
        scope,
        sub,
      }),

    getJWTBearerToken: async ({scope, sub}: {scope: string, sub: string}) => {

      return client.grant({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        scope,
        assertion: await createJWTBearerGrantToken(sub),
      })
    },

    createJWTBearerGrantToken,
  }
}
