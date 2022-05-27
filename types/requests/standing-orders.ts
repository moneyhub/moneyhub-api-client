import {ApiResponse} from "../request"
import {StandingOrderRequest, StandingOrderSearchParams} from "../schema/standing-order"

export interface StandingOrdersRequests {
  getStandingOrder: ({id}: {id: string})
    => Promise<ApiResponse<StandingOrderRequest>>
  getStandingOrders: (
    params?: StandingOrderSearchParams
  ) => Promise<ApiResponse<StandingOrderRequest[]>>
}
