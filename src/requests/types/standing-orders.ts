import {ApiResponse} from "src/request"
import {StandingOrderRequest, StandingOrderSearchParams} from "src/schema/standing-order"

export interface StandingOrdersRequests {
  getStandingOrder: ({id}: {id: string})
    => Promise<ApiResponse<StandingOrderRequest>>
  getStandingOrders: (
    params?: StandingOrderSearchParams
  ) => Promise<ApiResponse<StandingOrderRequest[]>>
}
