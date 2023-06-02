import {RequestsParams} from "../request"
import {TransactionsRequests} from "./types/transactions"

export default ({config, request}: RequestsParams): TransactionsRequests => {
  const {resourceServerUrl} = config

  return {
    getTransactions: ({userId, params}, options) =>
      request(`${resourceServerUrl}/transactions`, {
        searchParams: params,
        cc: {
          scope: "transactions:read:all",
          sub: userId,
        },
        options,
      }),
    getTransaction: ({userId, transactionId}, options) =>
      request(`${resourceServerUrl}/transactions/${transactionId}`, {
        cc: {
          scope: "transactions:read:all",
          sub: userId,
        },
        options,
      }),
    addTransaction: ({userId, transaction}, options) =>
      request(`${resourceServerUrl}/transactions`, {
        method: "POST",
        cc: {
          scope: "transactions:read:all transactions:write:all",
          sub: userId,
        },
        body: transaction,
        options,
      }),
    addTransactions: ({userId, transactions, params = {}}, options) =>
      request(`${resourceServerUrl}/transactions-collection`, {
        method: "POST",
        searchParams: params,
        cc: {
          scope: "transactions:read:all transactions:write:all",
          sub: userId,
        },
        body: transactions,
        options,
      }),
    updateTransaction: ({userId, transactionId, transaction}, options) =>
      request(`${resourceServerUrl}/transactions/${transactionId}`, {
        method: "PATCH",
        cc: {
          scope: "transactions:read:all transactions:write:all",
          sub: userId,
        },
        body: transaction,
        options,
      }),
    deleteTransaction: ({userId, transactionId}, options) =>
      request(`${resourceServerUrl}/transactions/${transactionId}`, {
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
