import {RequestsParams} from "../../request"
import type {ApiResponse} from "../../request"
import {CaasGeotagsRequests} from "./types/geotags"
import {CaasGeotag} from "./types/transactions"

export default ({config, request}: RequestsParams): CaasGeotagsRequests => {
  const {caasResourceServerUrl} = config

  return {
    caasGetGeotags: ({geotagIds}, options) => {
      return request<ApiResponse<CaasGeotag[]>>(
        `${caasResourceServerUrl}/geotags`,
        {
          method: "GET",
          cc: {
            scope: "caas:transactions:read",
          },
          searchParams: {geotagIds},

          options,
        },
      )
    },
  }
}
