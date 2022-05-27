import {ApiResponse, RequestsParams} from "../../types/request"
import {StandingOrdersRequests} from "../../types/requests/standing-orders"
import {StandingOrderRequest} from "../../types/schema/standing-order"

export default ({config, request}: RequestsParams): StandingOrdersRequests => {
  const {identityServiceUrl} = config

  const getStandingOrder = ({id}: {id: string}): Promise<ApiResponse<StandingOrderRequest>> =>
    request(`${identityServiceUrl}/standing-orders/${id}`, {
      cc: {
        scope: "payment:read",
      },
    })

  return {
    getStandingOrder,
    getStandingOrders: (params = {}) =>
      request(`${identityServiceUrl}/standing-orders`, {
        searchParams: params,
        cc: {
          scope: "payment:read",
        },
      }),
  }
}
