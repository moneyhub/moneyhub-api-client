import {ApiResponse} from "../request"
import {Payee, PayeesSearchParams} from "../schema/payee"

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
  }) => Promise<ApiResponse<Payee>>

  getPayees: (params?: PayeesSearchParams) => Promise<ApiResponse<Payee[]>>

  getPayee: ({id}: {id: string}) => Promise<ApiResponse<Payee>>
}
