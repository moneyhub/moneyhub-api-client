import type { Options } from "got";
import type { APIClientConfig, RequestsParams } from "../";
import { RequestsParams } from "..";

export type AccountRequestsParams = RequestsParams;

export default function AccountsRequests({ config, request }: AccountRequestsParams): AccountsRequests;

export interface AccountsRequests {
  getAccounts: ({ userId }: { userId: string; params: SearchParams }) => Promise<unknown>;
  getAccountsWithDetails: ({ userId }: { userId: string; params: SearchParams }) => Promise<unknown>;
  getAccount: ({ userId, accountId }: { userId: string; accountId: string }) => Promise<unknown>;
  getAccountBalances: ({ userId, accountId }: { userId: string; accountId: string }) => Promise<unknown>;
  getAccountWithDetails: ({ userId, accountId }: { userId: string; accountId: string }) => Promise<unknown>;
  getAccountHoldings: ({ userId, accountId }: { userId: string; accountId: string }) => Promise<unknown>;
  getAccountHoldingsWithMatches: ({ userId, accountId }: { userId: string; accountId: string }) => Promise<unknown>;
  getAccountCounterparties: ({ userId, accountId }: { userId: string; accountId: string }) => Promise<unknown>;
  getAccountRecurringTransactions: ({ userId, accountId }: { userId: string; accountId: string }) => Promise<unknown>;
  getAccountStandingOrders: ({ userId, accountId }: { userId: string; accountId: string }) => Promise<unknown>;
  createAccount: ({ userId }: { userId: string; account: Record<string, any> }) => Promise<unknown>;
  deleteAccount: ({ userId, accountId }: { userId: string; accountId: string }) => Promise<unknown>;
  getAccountHolding: ({ userId, accountId, holdingId}: { userId: string; accountId: string; holdingId: string;}) => Promise<unknown>;
  getAccountStandingOrdersWithDetail: ({ userId, accountId }: { userId: string; accountId: string;}) => Promise<unknown>;
}
