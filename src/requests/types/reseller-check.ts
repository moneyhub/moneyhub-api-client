import {ApiResponse, ExtraOptions} from "../../request"

export type CreateResellerCheckRequest = (
  {
    companyRegistrationNumber,
    email,
    telephone,
  }: {
    companyRegistrationNumber: string
    email: string
    telephone?: string
  },
  options?: ExtraOptions,
) => Promise<ApiResponse<null>>

export interface ResellerCheckRequests {
  createResellerCheckRequest: CreateResellerCheckRequest
}
