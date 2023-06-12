import {ApiResponse, ExtraOptions, SearchParams} from "../../request"
import {Beneficiary, BeneficiaryWithDetails} from "../../schema/beneficiary"

export interface BeneficiariesRequests {
  getBeneficiary: ({
    id,
    userId,
  }: {
    id: string
    userId?: string
  }, options?: ExtraOptions) => Promise<ApiResponse<Beneficiary>>

  getBeneficiaryWithDetail: ({
    id,
    userId,
  }: {
    id: string
    userId?: string
  }, options?: ExtraOptions) => Promise<ApiResponse<BeneficiaryWithDetails>>

  getBeneficiaries: ({
    params,
    userId,
  }: {
    params?: SearchParams
    userId?: string
  }, options?: ExtraOptions) => Promise<ApiResponse<Beneficiary[]>>

  getBeneficiariesWithDetail: ({
    params,
    userId,
  }: {
    params?: SearchParams
    userId?: string
  }, options?: ExtraOptions) => Promise<ApiResponse<BeneficiaryWithDetails[]>>
}
