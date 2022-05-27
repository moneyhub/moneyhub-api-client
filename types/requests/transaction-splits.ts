import {ApiResponse} from "../request"
import {TransactionSplit, TransactionSplitPatch, TransactionSplitPost} from "../schema/transaction"

export interface TransactionSplitsRequests {
  splitTransaction: ({
    userId,
    transactionId,
    splits,
  }: {
    userId: string
    transactionId: string
    splits: TransactionSplitPost
  }) => Promise<ApiResponse<TransactionSplit[]>>

  getTransactionSplits: ({
    userId,
    transactionId,
  }: {
    userId: string
    transactionId: string
  }) => Promise<ApiResponse<TransactionSplit[]>>

  patchTransactionSplit: ({
    userId,
    transactionId,
    splitId,
    split,
  }: {
    userId: string
    transactionId: string
    splitId: string
    split: TransactionSplitPatch
  }) => Promise<ApiResponse<TransactionSplit[]>>

  deleteTransactionSplits: ({
    userId,
    transactionId,
  }: {
    userId: string
    transactionId: string
  }) => Promise<number>
}
