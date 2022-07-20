import {ApiResponse} from "src/request"
import {Tax, TaxSearchParams} from "src/schema/tax"

export interface TaxRequests {
  getTaxReturn: ({
    userId,
    params,
  }: {
    userId: string
    params?: TaxSearchParams
  }) => Promise<ApiResponse<Tax>>
}