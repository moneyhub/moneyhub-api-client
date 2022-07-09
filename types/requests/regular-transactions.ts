import {ApiResponse} from "src/request"
import {RegularTransaction, RegularTransactionSearchParams} from "../schema/regular-transaction"

export interface RegularTransactionsRequests {
  getRegularTransactions: ({
    userId,
    params,
  }: {
    userId: string
    params?: RegularTransactionSearchParams
  }) => Promise<ApiResponse<RegularTransaction[]>>
}
