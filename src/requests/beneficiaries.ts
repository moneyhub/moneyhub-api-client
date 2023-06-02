import {ExtraOptions, RequestsParams, SearchParams} from "../request"
import {BeneficiariesRequests} from "./types/beneficiaries"
export default ({config, request}: RequestsParams): BeneficiariesRequests => {
  const {resourceServerUrl} = config
  const BENEFICIARIES_READ_SCOPE = "beneficiaries:read"
  const BENEFICIARIES_DETAIL_READ_SCOPE = "beneficiaries_detail:read"
  const getOneBeneficiary = ({
    id,
    userId,
    scope,
  }: {
    id: string
    userId: string
    scope: string
  }, options?: ExtraOptions): Promise<any> =>
    request(`${resourceServerUrl}/beneficiaries/${id}`, {
      cc: {
        sub: userId,
        scope,
      },
      options,
    })

  const getAllBeneficiaries = ({
    params,
    userId,
    scope,
  }: {
    params: SearchParams
    userId: string
    scope: string
  }, options?: ExtraOptions): Promise<any> =>
    request(`${resourceServerUrl}/beneficiaries`, {
      searchParams: params,
      cc: {
        sub: userId,
        scope,
      },
      options,
    })
  return {
    getBeneficiary: ({id, userId}, options) =>
      getOneBeneficiary({id, userId, scope: BENEFICIARIES_READ_SCOPE}, options),
    getBeneficiaryWithDetail: ({id, userId}, options) =>
      getOneBeneficiary({id, userId, scope: BENEFICIARIES_DETAIL_READ_SCOPE}, options),
    getBeneficiaries: ({userId, params = {}}, options) =>
      getAllBeneficiaries({params, userId, scope: BENEFICIARIES_READ_SCOPE}, options),
    getBeneficiariesWithDetail: ({userId, params = {}}, options) =>
      getAllBeneficiaries({params, userId, scope: BENEFICIARIES_DETAIL_READ_SCOPE}, options),
  }
}
