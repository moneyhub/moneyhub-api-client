import {ApiResponse} from "../request"
import {Tax, TaxSearchParams} from "../schema/tax"

export interface TaxRequests {
  getTaxReturn: ({
    userId,
    params,
  }: {
    userId: string
    params?: TaxSearchParams
  }) => Promise<ApiResponse<Tax>>
}
