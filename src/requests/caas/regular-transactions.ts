import {RequestsParams} from "../../request"
import type {ApiResponse} from "../../request"
import type {CaasRegularTransaction, CaasRegularTransactionsRequests} from "./types/regular-transactions"

export default ({config, request}: RequestsParams): CaasRegularTransactionsRequests => {
  const {caasResourceServerUrl} = config

  return {
    caasGetRegularTransactions: ({accountId}, options) => {
      return request<ApiResponse<CaasRegularTransaction[]>>(
        `${caasResourceServerUrl}/accounts/${accountId}/regular-transactions`,
        {
          cc: {
            scope: "caas:regular_transactions:read",
          },
          options,
        },
      )
    },
  }
}
