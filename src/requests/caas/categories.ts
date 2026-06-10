import {RequestsParams} from "../../request"
import type {ApiResponse} from "../../request"
import {CaasCategory, CaasCategoryGroup, CaasCategoriesRequests, CaasCustomCategory} from "./types/categories"

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
    caasGetCustomCategories: ({userId}, options) => {
      return request<ApiResponse<CaasCustomCategory[]>>(
        `${caasResourceServerUrl}/users/${userId}/custom-categories`,
        {
          method: "GET",
          cc: {
            scope: "caas:categories:read",
          },
          options,
        },
      )
    },
    caasCreateCustomCategory: ({userId, customCategoryName}, options) => {
      return request<ApiResponse<CaasCustomCategory>>(
        `${caasResourceServerUrl}/users/${userId}/custom-categories`,
        {
          method: "POST",
          cc: {
            scope: "caas:categories:write",
          },
          body: {customCategoryName},

          options,
        },
      )
    },
    caasDeleteCustomCategory: ({userId, categoryId}, options) => {
      return request<number>(
        `${caasResourceServerUrl}/users/${userId}/custom-categories/${categoryId}`,
        {
          method: "DELETE",
          cc: {
            scope: "caas:categories:delete",
          },
          returnStatus: true,

          options,
        },
      )
    },
  }
}
