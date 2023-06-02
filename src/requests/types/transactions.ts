import {ApiResponse, ExtraOptions} from "../../request"
import {Transaction, TransactionPatch, TransactionPost, TransactionSearchParams} from "../../schema/transaction"

export interface TransactionsRequests {
  getTransactions: ({
    userId,
    params,
  }: {
    userId: string
    params?: TransactionSearchParams
  }, options?: ExtraOptions) => Promise<ApiResponse<Transaction[]>>

  getTransaction: ({
    userId,
    transactionId,
  }: {
    userId: string
    transactionId: string
  }, options?: ExtraOptions) => Promise<ApiResponse<Transaction>>

  addTransaction: ({
    userId,
    transaction,
  }: {
    userId: string
    transaction: TransactionPost
  }, options?: ExtraOptions) => Promise<ApiResponse<Transaction>>

  addTransactions: ({
    userId,
    transactions,
    params,
  }: {
    userId: string
    transactions: TransactionPost[]
    params?: {
      categorise?: boolean
    }
  }, options?: ExtraOptions) => Promise<ApiResponse<{
    id: string
  }[]>>

  updateTransaction: ({
    userId,
    transactionId,
    transaction,
  }: {
    userId: string
    transactionId: string
    transaction: TransactionPatch
  }, options?: ExtraOptions) => Promise<ApiResponse<Transaction>>

  deleteTransaction: ({
    userId,
    transactionId,
  }: {
    userId: string
    transactionId: string
  }, options?: ExtraOptions) => Promise<ApiResponse<number>>
}
