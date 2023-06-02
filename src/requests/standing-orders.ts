import {ApiResponse, ExtraOptions, RequestsParams} from "../request"
import {StandingOrdersRequests} from "./types/standing-orders"
import {StandingOrderRequest} from "../schema/standing-order"

export default ({config, request}: RequestsParams): StandingOrdersRequests => {
  const {identityServiceUrl} = config

  const getStandingOrder = ({id}: {id: string}, options?: ExtraOptions): Promise<ApiResponse<StandingOrderRequest>> =>
    request(`${identityServiceUrl}/standing-orders/${id}`, {
      cc: {
        scope: "payment:read",
      },
      options,
    })

  return {
    getStandingOrder,
    getStandingOrders: (params = {}, options) =>
      request(`${identityServiceUrl}/standing-orders`, {
        searchParams: params,
        cc: {
          scope: "payment:read",
        },
        options,
      }),
  }
}
