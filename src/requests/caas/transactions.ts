import {RequestsParams} from "../../request"
import type {ApiResponse} from "../../request"
import {
  CaasEnrichTransactionsResponse,
  CaasTransaction,
  CaasTransactionsRequests,
} from "./types/transactions"
import type {CaasEnhancedTransaction} from "./types/enhanced-transactions"

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

      return request<CaasEnrichTransactionsResponse>(
        `${caasResourceServerUrl}/transactions/enrich`,
        {
          method: "POST",
          cc: {
            scope: "caas:transactions:write",
          },
          body: transactions,

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
    caasGetEnhancedTransaction: ({accountId, transactionId, includeFieldTiers}, options) => {
      return request<ApiResponse<CaasEnhancedTransaction>>(
        `${caasResourceServerUrl}/accounts/${accountId}/transactions/${transactionId}/enhanced`,
        {
          cc: {
            scope: "caas:enhanced_transactions:read",
          },
          searchParams: includeFieldTiers ? {includeFieldTiers} : undefined,

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
