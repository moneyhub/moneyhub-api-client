import type {ApiResponse, ExtraOptions, SearchParams} from "../../request"
import type {OsipAccount, OsipHolding, OsipTransaction} from "../../schema/osip"


export interface OsipRequests {
  getOsipAccounts: ({userId, params}: { userId?: string, params?: SearchParams }, options?: ExtraOptions) => Promise<Omit<ApiResponse<OsipAccount[]>, "links">>
  getOsipAccount: ({userId, accountId}: { userId?: string, accountId: string }, options?: ExtraOptions) => Promise<Omit<ApiResponse<OsipAccount>, "links">>
  getOsipAccountHoldings: ({
    userId,
    accountId,
  }: {
    userId?: string
    accountId: string
  }, options?: ExtraOptions) => Promise<ApiResponse<OsipHolding[]>>
  getOsipAccountTransactions: ({
    userId,
    accountId,
  }: {
    userId?: string
    accountId: string
  }, options?: ExtraOptions) => Promise<ApiResponse<OsipTransaction[]>>
}
