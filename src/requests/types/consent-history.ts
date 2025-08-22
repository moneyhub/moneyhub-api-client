import {ApiResponse, ExtraOptions} from "../../request"
import {ConsentHistory, ConsentHistorySearchParams} from "../../schema/consent-history"

export interface ConsentHistoryRequests {
  getConsentHistory: (params?: ConsentHistorySearchParams, options?: ExtraOptions) => Promise<ApiResponse<ConsentHistory[]>>
}
