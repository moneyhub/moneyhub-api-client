import {RequestsParams} from "../request"
import {CategoriesRequests} from "./types/categories"

export default ({config, request}: RequestsParams): CategoriesRequests => {
  const {resourceServerUrl} = config

  return {
    getCategories: async ({userId, params = {}}, options) =>
      request(`${resourceServerUrl}/categories`, {
        searchParams: params,
        cc: {
          scope: "categories:read",
          sub: userId,
        },
        options,
      }),

    getStandardCategories: async ({params = {}}, options) =>
      request(`${resourceServerUrl}/standard-categories`, {
        searchParams: params,
        options,
      }),

    getCategory: async ({userId, categoryId, params = {}}, options) =>
      request(`${resourceServerUrl}/categories/${categoryId}`, {
        searchParams: params,
        cc: {
          scope: "categories:read",
          sub: userId,
        },
        options,
      }),

    getCategoryGroups: async ({userId, params = {}}, options) =>
      request(`${resourceServerUrl}/category-groups`, {
        searchParams: params,
        cc: {
          scope: "categories:read",
          sub: userId,
        },
        options,
      }),

    getStandardCategoryGroups: async ({params = {}}, options) =>
      request(`${resourceServerUrl}/standard-category-groups`, {
        searchParams: params,
        options,
      }),

    createCustomCategory: async ({userId, category: {group, name}}, options) =>
      request(`${resourceServerUrl}/categories`, {
        method: "POST",
        cc: {
          scope: "categories:read categories:write",
          sub: userId,
        },
        body: {
          group,
          name,
        },
        options,
      }),
  }
}
