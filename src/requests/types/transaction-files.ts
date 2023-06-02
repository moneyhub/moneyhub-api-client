import {ApiResponse, ExtraOptions} from "../../request"
import {TransactionFile} from "../../schema/transaction"

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
    fileData: any
  }, options?: ExtraOptions) => Promise<ApiResponse<TransactionFile>>

  getTransactionFiles: ({
    userId,
    transactionId,
  }: {
    userId: string
    transactionId: string
  }, options?: ExtraOptions) => Promise<ApiResponse<TransactionFile[]>>

  getTransactionFile: ({
    userId,
    transactionId,
    fileId,
  }: {
    userId: string
    transactionId: string
    fileId: string
  }, options?: ExtraOptions) => Promise<ApiResponse<TransactionFile>>

  deleteTransactionFile: ({
    userId,
    transactionId,
    fileId,
  }: {
    userId: string
    transactionId: string
    fileId: string
  }, options?: ExtraOptions) => Promise<number>
}
