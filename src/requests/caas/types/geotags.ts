import {ApiResponse, ExtraOptions} from "../../../request"
import {CaasGeotag} from "./transactions"

export interface CaasGeotagsRequests {
  caasGetGeotags: ({
    geotagIds,
  }: {
    geotagIds: string[]
  }, options?: ExtraOptions) => Promise<ApiResponse<CaasGeotag[]>>
}
