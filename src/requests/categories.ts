import {RequestsParams} from "src/request"
import {CategoriesRequests} from "./types/categories"

export default ({config, request}: RequestsParams): CategoriesRequests => {
  const {resourceServerUrl} = config

  return {
    getCategories: async ({userId, params = {}}) =>
      request(`${resourceServerUrl}/categories`, {
        searchParams: params,
        cc: {
          scope: "categories:read",
          sub: userId,
        },
      }),

    getStandardCategories: async ({params = {}}) =>
      request(`${resourceServerUrl}/standard-categories`, {
        searchParams: params,
      }),

    getCategory: async ({userId, categoryId, params = {}}) =>
      request(`${resourceServerUrl}/categories/${categoryId}`, {
        searchParams: params,
        cc: {
          scope: "categories:read",
          sub: userId,
        },
      }),

    getCategoryGroups: async ({userId, params = {}}) =>
      request(`${resourceServerUrl}/category-groups`, {
        searchParams: params,
        cc: {
          scope: "categories:read",
          sub: userId,
        },
      }),

    getStandardCategoryGroups: async ({params = {}}) =>
      request(`${resourceServerUrl}/standard-category-groups`, {
        searchParams: params,
      }),

    createCustomCategory: async ({userId, category: {group, name}}) =>
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
      }),
  }
}
