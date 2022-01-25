import type { JSONWebKey } from "jose";

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

export interface APIClientConfig {
  resourceServerUrl: string;
  identityServiceUrl: string;
  options: {
    timeout?: number;
  };
  client: {
    client_id: string;
    client_secret: string;
    token_endpoint_auth_method: TokenEndpointAuthMethod;
    id_token_signed_response_alg: TokenSigningAlgorithm;
    request_object_signing_alg: TokenSigningAlgorithm;
    redirect_uri: string;
    response_type: ResponseType;
    keys: JSONWebKey[];
  };
}
