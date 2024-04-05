import type {JWK} from "jose"

export type use = "sig" | "enc";
export type keyOperation = "sign" | "verify" | "encrypt" | "decrypt" | "wrapKey" | "unwrapKey" | "deriveKey";
export type ECCurve = "P-256" | "secp256k1" | "P-384" | "P-521";
export type OKPCurve = "Ed25519" | "Ed448" | "X25519" | "X448";
export interface BasicParameters {
  alg?: string
  use?: use
  kid?: string
  key_ops?: keyOperation[]
}
export interface KeyParameters extends BasicParameters {
  x5c?: string[]
  x5t?: string
  "x5t#S256"?: string
}

export interface JWKOctKey extends BasicParameters { // no x5c
  kty: "oct"
  k?: string
}

export interface JWKECKey extends KeyParameters {
  kty: "EC"
  crv: ECCurve
  x: string
  y: string
  d?: string
}

export interface JWKOKPKey extends KeyParameters {
  kty: "OKP"
  crv: OKPCurve
  x: string
  d?: string
}

export interface JWKRSAKey extends KeyParameters {
  kty: "RSA"
  e: string
  n: string
  d?: string
  p?: string
  q?: string
  dp?: string
  dq?: string
  qi?: string
}

export type TokenSigningAlgorithm =
  | "HS256"
  | "HS384"
  | "HS512"
  | "RS256"
  | "RS384"
  | "RS512"
  | "ES256"
  | "ES384"
  | "ES512"
  | "PS256"
  | "PS384"
  | "PS512"
  | "none";

export type ResponseType =
  | "code"
  | "token"
  | "id_token"
  | "code token"
  | "code id_token"
  | "id_token token"
  | "code id_token token";

export type TokenEndpointAuthMethod =
  | "client_secret_post"
  | "client_secret_basic"
  | "client_secret_jwt"
  | "private_key_jwt";

export interface ApiClientConfig {
  resourceServerUrl: string
  osipResourceServerUrl?: string
  identityServiceUrl: string
  accountConnectUrl?: string
  options?: {
    timeout?: number
    apiVersioning?: boolean
  }
  client: {
    client_id: string
    client_secret: string
    token_endpoint_auth_method: TokenEndpointAuthMethod
    id_token_signed_response_alg: TokenSigningAlgorithm
    request_object_signing_alg: TokenSigningAlgorithm
    redirect_uri: string
    response_type: ResponseType
    keys: JWK[]
  }
}
