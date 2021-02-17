module.exports = ({config, request}) => {
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

    createCustomCategory: async ({userId, category: {group, name}}) =>
      request(`${resourceServerUrl}/categories`, {
        method: "POST",
        cc: {
          scope: "categories:read categories:write",
          sub: userId,
        },
        body: {
          group,
          name
        }
      }),
  }
}
