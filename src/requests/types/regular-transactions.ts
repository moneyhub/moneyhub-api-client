import {ApiResponse, ExtraOptions} from "../../request"
import {RegularTransaction, RegularTransactionSearchParams} from "../../schema/regular-transaction"

export interface RegularTransactionsRequests {
  getRegularTransactions: ({
    userId,
    params,
  }: {
    userId?: string
    params?: RegularTransactionSearchParams
  }, options?: ExtraOptions) => Promise<ApiResponse<RegularTransaction[]>>

  detectRegularTransactions: ({
    userId,
    accountId,
  }: {
    userId?: string
    accountId: string
  }, options?: ExtraOptions) => Promise<ApiResponse<RegularTransaction[]>>
}
