import {RequestsParams} from "../request"
import {TransactionFilesRequests} from "./types/transaction-files"

import FormData from "form-data"

export default ({config, request}: RequestsParams): TransactionFilesRequests => {
  const {resourceServerUrl} = config

  return {
    addFileToTransaction: async ({userId, transactionId, fileData, fileName}, options) => {
      const formData = new FormData()
      formData.append("file", fileData, fileName)
      return request(
        `${resourceServerUrl}/transactions/${transactionId}/files`,
        {
          method: "POST",
          formData,
          cc: {
            scope: "transactions:read:all transactions:write",
            sub: userId,
          },
          options,
        },
      )
    },
    getTransactionFiles: async ({userId, transactionId}, options) =>
      request(`${resourceServerUrl}/transactions/${transactionId}/files`, {
        cc: {
          scope: "transactions:read:all transactions:write",
          sub: userId,
        },
        options,
      }),

    getTransactionFile: async ({userId, transactionId, fileId}, options) =>
      request(
        `${resourceServerUrl}/transactions/${transactionId}/files/${fileId}`,
        {
          cc: {
            scope: "transactions:read:all transactions:write",
            sub: userId,
          },
          options,
        },
      ),

    deleteTransactionFile: async ({userId, transactionId, fileId}, options) =>
      request(
        `${resourceServerUrl}/transactions/${transactionId}/files/${fileId}`,
        {
          method: "DELETE",
          cc: {
            scope: "transactions:read:all transactions:write",
            sub: userId,
          },
          returnStatus: true,
          options,
        },
      ),
  }
}
