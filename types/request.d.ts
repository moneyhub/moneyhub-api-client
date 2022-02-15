import type { Options } from 'got';

export type TokenSigningAlgorithm =
  | 'HS256'
  | 'HS384'
  | 'HS512'
  | 'RS256'
  | 'RS384'
  | 'RS512'
  | 'ES256'
  | 'ES384'
  | 'ES512'
  | 'PS256'
  | 'PS384'
  | 'PS512'
  | 'none';

export type ResponseType =
  | 'code'
  | 'token'
  | 'id_token'
  | 'code token'
  | 'code id_token'
  | 'id_token token'
  | 'code id_token token';

export type TokenEndpointAuthMethod =
  | 'client_secret_post'
  | 'client_secret_basic'
  | 'client_secret_jwt'
  | 'private_key_jwt';

export interface GotRequestParams {
  client: any;
  options: Options;
}

export interface RequestOptions {
  method?: Options['method'];
  headers?: Options['headers'];
  searchParams?: Options['searchParams'];
  json?: Options['json'];
  form?: Options['form'];
  body?: Record<string, any>;
  returnStatus?: boolean;
  cc?: {
    scope: string;
    sub?: string;
  };
}
