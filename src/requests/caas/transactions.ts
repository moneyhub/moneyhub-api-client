import {RequestsParams} from "../../request"
import type {ApiResponse} from "../../request"
import {CaasTransaction, CaasTransactionsRequests} from "./types/transactions"

export default ({config, request}: RequestsParams): CaasTransactionsRequests => {
  const {caasResourceServerUrl} = config

  return {
    caasPatchTransaction: ({accountId, transactionId, l2CategoryId}, options) => {

      return request<ApiResponse<CaasTransaction[]>>(
        `${caasResourceServerUrl}/accounts/${accountId}/transactions/${transactionId}`,
        {
          method: "PATCH",
          cc: {
            scope: "caas:transactions:write",
          },
          body: {l2CategoryId},

          options,
        },
      )
    },
    caasEnrichTransactions: ({transactions}, options) => {

      return request<ApiResponse<CaasTransaction[]>>(
        `${caasResourceServerUrl}/transactions/enrich`,
        {
          method: "POST",
          cc: {
            scope: "caas:transactions:write",
          },
          body: {transactions},

          options,
        },
      )
    },
    caasGetTransactions: ({userId, accountId, limit}, options) => {
      return request<ApiResponse<CaasTransaction[]>>(
        `${caasResourceServerUrl}/transactions`,
        {
          cc: {
            scope: "caas:transactions:read",
          },
          searchParams: {accountId, userId, limit},

          options,
        },
      )
    },
    caasDeleteTransaction: ({accountId, transactionId}, options) => {
      return request<void>(
        `${caasResourceServerUrl}/accounts/${accountId}/transactions/${transactionId}`,
        {
          method: "DELETE",
          cc: {
            scope: "caas:transactions:delete",
          },

          options,
        },
      )
    },
  }
}
