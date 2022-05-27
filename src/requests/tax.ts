import {RequestsParams} from "../../types/request"
import {TaxRequests} from "../../types/requests/tax"
import * as R from "ramda"

export default ({config, request}: RequestsParams): TaxRequests => {
  const {resourceServerUrl} = config

  return {
    getTaxReturn: ({userId, params = {}}) =>
      request(`${resourceServerUrl}/tax`, {
        searchParams: R.reject(R.isNil)(params),
        cc: {
          scope: "tax:read",
          sub: userId,
        },
      }),
  }
}
