import {ApiResponse, ExtraOptions} from "../../request"
import {StandingOrderRequest, StandingOrderSearchParams} from "../../schema/standing-order"

export interface StandingOrdersRequests {
  getStandingOrder: ({id}: {id: string}, options?: ExtraOptions)
    => Promise<ApiResponse<StandingOrderRequest>>
  getStandingOrders: (
    params?: StandingOrderSearchParams, options?: ExtraOptions
  ) => Promise<ApiResponse<StandingOrderRequest[]>>
}
