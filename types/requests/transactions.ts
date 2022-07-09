import {ApiResponse} from "src/request"
import {Transaction, TransactionPatch, TransactionPost, TransactionSearchParams} from "../schema/transaction"

export interface TransactionsRequests {
  getTransactions: ({
    userId,
    params,
  }: {
    userId: string
    params?: TransactionSearchParams
  }) => Promise<ApiResponse<Transaction[]>>

  getTransaction: ({
    userId,
    transactionId,
  }: {
    userId: string
    transactionId: string
  }) => Promise<ApiResponse<Transaction>>

  addTransaction: ({
    userId,
    transaction,
  }: {
    userId: string
    transaction: TransactionPost
  }) => Promise<ApiResponse<Transaction>>

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
  }) => Promise<ApiResponse<{
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
  }) => Promise<ApiResponse<Transaction>>

  deleteTransaction: ({
    userId,
    transactionId,
  }: {
    userId: string
    transactionId: string
  }) => Promise<ApiResponse<number>>
}
