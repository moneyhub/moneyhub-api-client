import {ApiResponse, ExtraOptions} from "../../../request"

export interface CaasCategory {
  l2CategoryId: string
  l2CategoryName: string
  l1CategoryGroupId: string
  l1CategoryGroupName: string
}

export interface CaasCategoryGroup {
  l1CategoryGroupId: string
  l1CategoryGroupName: string
  l1CategoryType: string
}

export interface CaasCategoriesRequests {
  caasGetCategories: (options?: ExtraOptions) => Promise<ApiResponse<CaasCategory[]>>
  caasGetCategoryGroups: (options?: ExtraOptions) => Promise<ApiResponse<CaasCategoryGroup[]>>
}
