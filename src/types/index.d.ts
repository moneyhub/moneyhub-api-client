import type { AccountsMethods } from "./requests/accounts";
import type { AuthRequestsMethods } from "./requests/auth-requests";
import type { RequestOptions } from "./request";
import type { Options } from "got";

declare module "@mft/moneyhub-api-client" {
  async function Factory(apiClientConfig: APIClientConfig): Promise<MoneyHub>;
  export default Factory;
}

interface MoneyHub {
  getAccounts: AccountsMethods["getAccounts"];
  getAccountsWithDetails: AccountsMethods["getAccountsWithDetails"];
  getAccount: AccountsMethods["getAccount"];
  getAccountBalances: AccountsMethods["getAccountBalances"];
  getAccountWithDetails: AccountsMethods["getAccountWithDetails"];
  getAccountHoldings: AccountsMethods["getAccountHoldings"];
  getAccountHoldingsWithMatches: AccountsMethods["getAccountHoldingsWithMatches"];
  getAccountHolding: AccountsMethods["getAccountHolding"];
  getAccountCounterparties: AccountsMethods["getAccountCounterparties"];
  getAccountRecurringTransactions: AccountsMethods["getAccountRecurringTransactions"];
  getAccountStandingOrders: AccountsMethods["getAccountStandingOrders"];
  getAccountStandingOrdersWithDetail: AccountsMethods["getAccountStandingOrdersWithDetail"];
  createAccount: AccountsMethods["createAccount"];
  deleteAccount: AccountsMethods["deleteAccount"];
  createAuthRequest: AuthRequestsMethods["createAuthRequest"];
  completeAuthRequest: AuthRequestsMethods["completeAuthRequest"];
  getAllAuthRequests: AuthRequestsMethods["getAllAuthRequests"];
  getAuthRequest: AuthRequestsMethods["getAuthRequest"];

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

export type SearchParams = Options["searchParams"];
