import { Client } from 'openid-client';
import type { APIClientConfig } from '../types';

export interface TokensRequestsParams {
  client: Client;
  config: APIClientConfig;
}

export default function TokensRequests({ client, config }: TokensRequestsParams): TokensRequests;

interface TokensRequests {
  exchangeCodeForTokensLegacy({
    state,
    code,
    nonce,
    id_token,
  }: {
    state: string;
    code: string;
    nonce: string;
    id_token: string;
  }): Promise<any>;
}
