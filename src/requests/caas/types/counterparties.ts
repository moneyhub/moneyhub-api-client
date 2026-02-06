import {ApiResponse, ExtraOptions} from "../../../request"
import {CaasCounterparty} from "./transactions"

export interface CaasCounterpartiesRequests {
  caasGetCounterparties: ({
    limit,
    offset,
  }: {
    limit?: number
    offset?: number
  }, options?: ExtraOptions) => Promise<ApiResponse<CaasCounterparty[]>>
}
