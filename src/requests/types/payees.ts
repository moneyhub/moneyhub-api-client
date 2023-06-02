import {ApiResponse, ExtraOptions} from "../../request"
import {Payee, PayeesSearchParams} from "../../schema/payee"

export interface PayeesRequests {
  addPayee: ({
    accountNumber,
    sortCode,
    name,
    externalId,
    userId,
  }: {
    accountNumber: string
    sortCode: string
    name: string
    externalId?: string
    userId?: string
  }, options?: ExtraOptions) => Promise<ApiResponse<Payee>>

  getPayees: (params?: PayeesSearchParams, options?: ExtraOptions) => Promise<ApiResponse<Payee[]>>

  getPayee: ({id}: {id: string}, options?: ExtraOptions) => Promise<ApiResponse<Payee>>
}
