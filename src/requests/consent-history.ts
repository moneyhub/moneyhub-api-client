import {RequestsParams} from "../request"
import {ConsentHistoryRequests} from "./types/consent-history"

export default ({config, request}: RequestsParams): ConsentHistoryRequests => {
  const {identityServiceUrl} = config

  return {
    getConsentHistory: async (params = {}, options) =>
      request(`${identityServiceUrl}/consent-history`, {
        method: "GET",
        searchParams: params,
        cc: {
          scope: "consent-history:read",
        },
        options,
      }),
  }
}
