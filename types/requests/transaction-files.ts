import {ApiResponse} from "src/request"
import {TransactionFile} from "../schema/transaction"

export interface TransactionFilesRequests {
  addFileToTransaction: ({
    userId,
    transactionId,
    fileData,
    fileName,
  }: {
    userId: string
    transactionId: string
    fileName: string
    fileData: Blob
  }) => Promise<ApiResponse<TransactionFile>>

  getTransactionFiles: ({
    userId,
    transactionId,
  }: {
    userId: string
    transactionId: string
  }) => Promise<ApiResponse<TransactionFile[]>>

  getTransactionFile: ({
    userId,
    transactionId,
    fileId,
  }: {
    userId: string
    transactionId: string
    fileId: string
  }) => Promise<ApiResponse<TransactionFile>>

  deleteTransactionFile: ({
    userId,
    transactionId,
    fileId,
  }: {
    userId: string
    transactionId: string
    fileId: string
  }) => Promise<number>
}
