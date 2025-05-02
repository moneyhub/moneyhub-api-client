import {ApiResponse, ExtraOptions} from "../../request"
import {
  CategorisedTransaction,
  TransactionToBeCategorised,
} from "../../schema/categorised-transactions"

type AccountType = "cash" | "card" | "savings" | "pension" | "investment"

type CategoriseTransactionResponseData = {
  accountId: string
  accountType: AccountType
  transactions: CategorisedTransaction[]
  failedCategorisationIds: string[]
}

export type CategoriseTransactionsRequest = (
  {
    accountId,
    accountType,
    transactions,
  }: {
    accountId?: string
    accountType?: AccountType
    transactions: TransactionToBeCategorised[]
  },
  options?: ExtraOptions,
) => Promise<ApiResponse<CategoriseTransactionResponseData>>

export interface CategoriseTransactionsRequests {
  categoriseTransactions: CategoriseTransactionsRequest
}
