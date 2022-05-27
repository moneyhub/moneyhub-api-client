import {RequestsParams} from "../../types/request"
import {UsersAndConnectionsRequests} from "../../types/requests/users-and-connections"

export default ({config, request}: RequestsParams): UsersAndConnectionsRequests => {
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

    getConnectionSyncs: async ({userId, connectionId, params = {}}) =>
      request(`${usersEndpoint}/${userId}/connections/${connectionId}/syncs`, {
        searchParams: params,
        cc: {
          scope: "user:read",
        },
      }),

    getSync: async ({userId, syncId}) =>
      request(`${usersEndpoint}/${userId}/syncs/${syncId}`, {
        cc: {
          scope: "user:read",
        },
      }),

    updateUserConnection: async ({userId, connectionId, expiresAt}) =>
      request(`${usersEndpoint}/${userId}/connections/${connectionId}`, {
        method: "PATCH",
        returnStatus: true,
        cc: {
          scope: "user:update",
        },
        body: {expiresAt},
      }),
  }
}
