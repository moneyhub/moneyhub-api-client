import { TransactionFilesRequests, TransactionFilesRequestsParams } from "../types/requests/transaction-files";

import FormData from "form-data";

export default ({ config, request }: TransactionFilesRequestsParams): TransactionFilesRequests => {
  const { resourceServerUrl } = config;

  return {
    addFileToTransaction: async ({ userId, transactionId, fileData, fileName }) => {
      const form = new FormData();
      form.append("file", fileData, fileName);
      return request(`${resourceServerUrl}/transactions/${transactionId}/files`, {
        method: "POST",
        form,
        cc: {
          scope: "transactions:read:all transactions:write",
          sub: userId,
        },
      });
    },

    getTransactionFiles: async ({ userId, transactionId }) =>
      request(`${resourceServerUrl}/transactions/${transactionId}/files`, {
        cc: {
          scope: "transactions:read:all transactions:write",
          sub: userId,
        },
      }),

    getTransactionFile: async ({ userId, transactionId, fileId }) =>
      request(`${resourceServerUrl}/transactions/${transactionId}/files/${fileId}`, {
        cc: {
          scope: "transactions:read:all transactions:write",
          sub: userId,
        },
      }),

    deleteTransactionFile: async ({ userId, transactionId, fileId }) =>
      request(`${resourceServerUrl}/transactions/${transactionId}/files/${fileId}`, {
        method: "DELETE",
        cc: {
          scope: "transactions:read:all transactions:write",
          sub: userId,
        },
        returnStatus: true,
      }),
  };
};
