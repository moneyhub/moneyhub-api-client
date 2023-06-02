import {RequestsParams} from "../request"
import {TransactionSplitsRequests} from "./types/transaction-splits"

export default ({config, request}: RequestsParams): TransactionSplitsRequests => {
  const {resourceServerUrl} = config
  return {
    splitTransaction: async ({
      userId,
      transactionId,
      splits,
    }, options) =>
      request(`${resourceServerUrl}/transactions/${transactionId}/splits`, {
        method: "POST",
        cc: {
          scope: "transactions:write:all",
          sub: userId,
        },
        body: splits,
        options,
      }),

    getTransactionSplits: async ({
      userId,
      transactionId,
    }, options) =>
      request(`${resourceServerUrl}/transactions/${transactionId}/splits`, {
        cc: {
          scope: "transactions:read:all",
          sub: userId,
        },
        options,
      }),

    patchTransactionSplit: async ({
      userId,
      transactionId,
      splitId,
      split,
    }, options) =>
      request(`${resourceServerUrl}/transactions/${transactionId}/splits/${splitId}`, {
        method: "PATCH",
        cc: {
          scope: "transactions:write:all",
          sub: userId,
        },
        body: split,
        options,
      }),

    deleteTransactionSplits: async ({
      userId,
      transactionId,
    }, options) =>
      request(`${resourceServerUrl}/transactions/${transactionId}/splits`, {
        method: "DELETE",
        cc: {
          scope: "transactions:write:all",
          sub: userId,
        },
        returnStatus: true,
        options,
      }),
  }
}
