import { Client } from 'openid-client';
import type { APIClientConfig } from '../types';

export interface GetAuthUrlsRequestsParams {
  client: Client;
  config: APIClientConfig;
}

export default function GetAuthUrlsRequests({
  client,
  config,
}: GetAuthUrlsRequestsParams): GetAuthUrlsRequests;

interface GetAuthUrlsRequests {
  getAuthorizeUrl: (params: {
    state: string;
    scope: string;
    nonce: string;
    claims?: {};
    permissions: string[];
  }) => Promise<string>;
}
