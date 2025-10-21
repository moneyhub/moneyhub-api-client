import {ApiResponse, ExtraOptions} from "../../request"
import {ConsentHistorySearchParams, ConsentHistory} from "../../schema/consent-history"

export interface ConsentHistoryRequests {
  getConsentHistory: (params?: ConsentHistorySearchParams, options?: ExtraOptions) => Promise<ApiResponse<ConsentHistory[]>>
}
