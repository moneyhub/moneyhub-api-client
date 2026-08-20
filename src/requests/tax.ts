import {RequestsParams} from "../request"
import {TaxRequests} from "./types/tax"
import {reject, isNil} from "ramda"

export default ({config, request}: RequestsParams): TaxRequests => {
  const {resourceServerUrl} = config

  return {
    getTaxReturn: ({userId, params = {}}, options) =>
      request(`${resourceServerUrl}/tax`, {
        searchParams: reject(isNil, params),
        cc: {
          scope: "tax:read",
          sub: userId,
        },
        options,
      }),
  }
}
