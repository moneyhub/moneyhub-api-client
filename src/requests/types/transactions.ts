import {ApiResponse, ExtraOptions} from "../../request"
import {Transaction, TransactionPatch, TransactionPost, TransactionSearchParams,  TransactionUnenrichedSearchParams, TransactionUnenriched} from "../../schema/transaction"

export interface TransactionsRequests {
  getTransactions: ({
    userId,
    params,
  }: {
    userId?: string
    params?: TransactionSearchParams
  }, options?: ExtraOptions) => Promise<ApiResponse<Transaction[]>>
  getUnenrichedTransactions: ({
    userId,
    params,
  }: {
    userId?: string
    params?: TransactionUnenrichedSearchParams
  }, options?: ExtraOptions) => Promise<ApiResponse<TransactionUnenriched[]>>

  getTransaction: ({
    userId,
    transactionId,
  }: {
    userId?: string
    transactionId: string
  }, options?: ExtraOptions) => Promise<ApiResponse<Transaction>>
  getUnenrichedTransaction: ({
    userId,
    transactionId,
  }: {
    userId?: string
    transactionId: string
  }, options?: ExtraOptions) => Promise<ApiResponse<TransactionUnenriched>>

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
