import type {RequestsParams} from "../request"
import type {UsersAndConnectionsRequests} from "../requests/types/users-and-connections"

export default ({config, request}: RequestsParams): UsersAndConnectionsRequests => {
  const {identityServiceUrl} = config
  const usersEndpoint = identityServiceUrl + "/users"
  const scimUsersEndpoint = identityServiceUrl + "/scim/users"

  return {
    registerUser: async ({clientUserId}, options) =>
      request(usersEndpoint, {
        method: "POST",
        cc: {
          scope: "user:create",
        },
        body: {clientUserId},
        options,
      }),

    getUsers: async (params = {}, options) =>
      request(usersEndpoint, {
        searchParams: params,
        cc: {
          scope: "user:read",
        },
        options,
      }),

    registerSCIMUser: async ({
      externalId,
      name,
      emails,
      subtenant,
    }, options) =>
      request(scimUsersEndpoint, {
        method: "POST",
        cc: {
          scope: "scim_user:write",
        },
        body: {
          externalId,
          name,
          emails,
          "urn:ietf:params:scim:schemas:extension:moneyhub:2.0:Subtenant": subtenant,
        },
        options,
      }),

    getSCIMUser: async ({userId}, options) =>
      request(`${scimUsersEndpoint}/${userId}`, {
        cc: {
          scope: "scim_user:read",
        },
        options,
      }),

    getUser: async ({userId}, options) =>
      request(`${usersEndpoint}/${userId}`, {
        cc: {
          scope: "user:read",
        },
        options,
      }),

    getUserConnections: async ({userId}, options) =>
      request(`${usersEndpoint}/${userId}/connections`, {
        cc: {
          scope: "connection:read",
        },
        options,
      }),

    deleteUserConnection: async ({userId, connectionId}, options) =>
      request(`${usersEndpoint}/${userId}/connection/${connectionId}`, {
        method: "DELETE",
        returnStatus: true,
        cc: {
          scope: "connection:delete",
        },
        options,
      }),

    deleteUser: async ({userId}, options) =>
      request(`${usersEndpoint}/${userId}`, {
        method: "DELETE",
        returnStatus: true,
        cc: {
          scope: "user:delete",
        },
        options,
      }),

    getConnectionSyncs: async ({userId, connectionId, params = {}}, options) =>
      request(`${usersEndpoint}/${userId}/connections/${connectionId}/syncs`, {
        searchParams: params,
        cc: {
          scope: "connection:read",
        },
        options,
      }),

    getUserSyncs: async ({userId, params = {}}, options) =>
      request(`${usersEndpoint}/${userId}/syncs`, {
        searchParams: params,
        cc: {
          scope: "connection:read",
        },
        options,
      }),

    getSync: async ({userId, syncId}, options) =>
      request(`${usersEndpoint}/${userId}/syncs/${syncId}`, {
        cc: {
          scope: "connection:read",
        },
        options,
      }),

    updateUserConnection: async ({userId, connectionId, expiresAt}, options) =>
      request(`${usersEndpoint}/${userId}/connections/${connectionId}`, {
        method: "PATCH",
        returnStatus: true,
        cc: {
          scope: "connection:update",
        },
        body: {expiresAt},
        options,
      }),
  }
}
