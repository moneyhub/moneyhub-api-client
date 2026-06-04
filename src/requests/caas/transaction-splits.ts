import {RequestsParams} from "../../request"
import type {ApiResponse} from "../../request"
import {
  CaasTransactionSplit,
  CaasTransactionSplitsRequests,
} from "./types/transaction-splits"

export default ({config, request}: RequestsParams): CaasTransactionSplitsRequests => {
  const {caasResourceServerUrl} = config

  return {
    caasPutTransactionSplits: ({accountId, transactionId, splits}, options) => {
      return request<ApiResponse<CaasTransactionSplit[]>>(
        `${caasResourceServerUrl}/accounts/${accountId}/transactions/${transactionId}/splits`,
        {
          method: "PUT",
          cc: {
            scope: "caas:transaction_splits:write",
          },
          body: {data: splits},

          options,
        },
      )
    },
    caasDeleteTransactionSplits: ({accountId, transactionId}, options) => {
      return request<number>(
        `${caasResourceServerUrl}/accounts/${accountId}/transactions/${transactionId}/splits`,
        {
          method: "DELETE",
          cc: {
            scope: "caas:transaction_splits:delete",
          },
          returnStatus: true,

          options,
        },
      )
    },
  }
}
