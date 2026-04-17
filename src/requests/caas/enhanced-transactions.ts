import {RequestsParams} from "../../request"
import type {ApiResponse} from "../../request"
import type {
  CaasEnhancedTransaction,
  CaasEnhancedTransactionsRequests,
} from "./types/enhanced-transactions"

export default ({config, request}: RequestsParams): CaasEnhancedTransactionsRequests => {
  const {caasResourceServerUrl} = config

  return {
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
  }
}
