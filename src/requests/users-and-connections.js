module.exports = ({config, request}) => {
  const {identityServiceUrl} = config
  const usersEndpoint = identityServiceUrl + "/users"
  const scimUsersEndpoint = identityServiceUrl + "/scim/users"

  return {
    registerUser: async ({clientUserId}) =>
      request(usersEndpoint, {
        method: "POST",
        cc: {
          scope: "user:create",
        },
        body: {clientUserId},
      }),

    getUsers: async (params = {}) =>
      request(usersEndpoint, {
        searchParams: params,
        cc: {
          scope: "user:read",
        },
      }),

    getSCIMUsers: async (params = {}) =>
      request(scimUsersEndpoint, {
        searchParams: params,
        cc: {
          scope: "scim_user:read",
        },
      }),

    getUser: async ({userId}) =>
      request(`${usersEndpoint}/${userId}`, {
        cc: {
          scope: "user:read",
        },
      }),

    getUserConnections: async ({userId}) =>
      request(`${usersEndpoint}/${userId}/connections`, {
        cc: {
          scope: "user:read",
        },
      }),

    deleteUserConnection: async ({userId, connectionId}) =>
      request(`${usersEndpoint}/${userId}/connection/${connectionId}`, {
        method: "DELETE",
        returnStatus: true,
        cc: {
          scope: "user:delete",
        },
      }),

    deleteUser: async ({userId}) =>
      request(`${usersEndpoint}/${userId}`, {
        method: "DELETE",
        returnStatus: true,
        cc: {
          scope: "user:delete",
        },
      }),
  }
}
