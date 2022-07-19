import {ApiResponse, SearchParams} from "src/request"
import {Beneficiary, BeneficiaryWithDetails} from "src/schema/beneficiary"

export interface BeneficiariesRequests {
  getBeneficiary: ({
    id,
    userId,
  }: {
    id: string
    userId: string
  }) => Promise<ApiResponse<Beneficiary>>

  getBeneficiaryWithDetail: ({
    id,
    userId,
  }: {
    id: string
    userId: string
  }) => Promise<ApiResponse<BeneficiaryWithDetails>>

  getBeneficiaries: ({
    params,
    userId,
  }: {
    params?: SearchParams
    userId: string
  }) => Promise<ApiResponse<Beneficiary[]>>

  getBeneficiariesWithDetail: ({
    params,
    userId,
  }: {
    params?: SearchParams
    userId: string
  }) => Promise<ApiResponse<BeneficiaryWithDetails[]>>
}
