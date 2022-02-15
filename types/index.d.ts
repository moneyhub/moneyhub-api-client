import type { AccountsRequests } from './requests/accounts';
import type { AuthRequests } from './requests/auth-requests';
import type { JSONWebKey, JSONWebKeySet } from 'jose';
import type {
  RequestOptions,
  TokenEndpointAuthMethod,
  TokenSigningAlgorithm,
  ResponseType,
} from './request';
import type { Options } from 'got';

declare module '@mft/moneyhub-api-client' {
  async function Factory(apiClientConfig: APIClientConfig): Promise<MoneyHub>;
  export default Factory;
}

interface MoneyHub {
  getAccounts: AccountsRequests['getAccounts'];
  getAccountsWithDetails: AccountsRequests['getAccountsWithDetails'];
  getAccount: AccountsRequests['getAccount'];
  getAccountBalances: AccountsRequests['getAccountBalances'];
  getAccountWithDetails: AccountsRequests['getAccountWithDetails'];
  getAccountHoldings: AccountsRequests['getAccountHoldings'];
  getAccountHoldingsWithMatches: AccountsRequests['getAccountHoldingsWithMatches'];
  getAccountHolding: AccountsRequests['getAccountHolding'];
  getAccountCounterparties: AccountsRequests['getAccountCounterparties'];
  getAccountRecurringTransactions: AccountsRequests['getAccountRecurringTransactions'];
  getAccountStandingOrders: AccountsRequests['getAccountStandingOrders'];
  getAccountStandingOrdersWithDetail: AccountsRequests['getAccountStandingOrdersWithDetail'];
  createAccount: AccountsRequests['createAccount'];
  deleteAccount: AccountsRequests['deleteAccount'];
  createAuthRequest: AuthRequests['createAuthRequest'];
  completeAuthRequest: AuthRequests['completeAuthRequest'];
  getAllAuthRequests: AuthRequests['getAllAuthRequests'];
  getAuthRequest: AuthRequests['getAuthRequest'];

  keys: () => JSONWebKeySet | null;
}

interface APIClientConfig {
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

export interface RequestsParams {
  config: APIClientConfig;
  request: (url: string, opts?: RequestOptions) => Promise<unknown>;
}

export type SearchParams = Options['searchParams'];
