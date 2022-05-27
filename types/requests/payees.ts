import {ApiResponse, SearchParams} from "../request"
import {Payee} from "../schema/payee"

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

  getPayees: (params?: SearchParams) => Promise<ApiResponse<Payee[]>>

  getPayee: ({id}: {id: string}) => Promise<ApiResponse<Payee>>
}
