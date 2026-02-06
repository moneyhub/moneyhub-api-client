import {RequestsParams} from "../../request"
import type {ApiResponse} from "../../request"
import {CaasCounterpartiesRequests} from "./types/counterparties"
import type {CaasCounterparty} from "./types/transactions"

export default ({config, request}: RequestsParams): CaasCounterpartiesRequests => {
  const {caasResourceServerUrl} = config

  return {
    caasGetCounterparties: ({limit, offset}, options) => {
      return request<ApiResponse<CaasCounterparty[]>>(
        `${caasResourceServerUrl}/counterparties`,
        {
          method: "GET",
          cc: {
            scope: "caas:transactions:read",
          },
          searchParams: {limit, offset},
          options,
        },
      )
    },
  }
}
