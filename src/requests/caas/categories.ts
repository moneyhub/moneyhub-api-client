import {RequestsParams} from "../../request"
import type {ApiResponse} from "../../request"
import {CaasCategory, CaasCategoryGroup, CaasCategoriesRequests} from "./types/categories"

export default ({config, request}: RequestsParams): CaasCategoriesRequests => {
  const {caasResourceServerUrl} = config

  return {
    caasGetCategories: (options) => {
      return request<ApiResponse<CaasCategory[]>>(
        `${caasResourceServerUrl}/categories`,
        {
          method: "GET",
          cc: {
            scope: "caas:categories:read",
          },
          options,
        },
      )
    },
    caasGetCategoryGroups: (options) => {
      return request<ApiResponse<CaasCategoryGroup[]>>(
        `${caasResourceServerUrl}/category-groups`,
        {
          method: "GET",
          cc: {
            scope: "caas:categories:read",
          },
          options,
        },
      )
    },
  }
}
