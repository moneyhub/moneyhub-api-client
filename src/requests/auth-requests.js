module.exports = ({config, request}) => {
  const {identityServiceUrl} = config
  const authRequestEndpoint = identityServiceUrl + "/auth-requests"

  return {
    createAuthRequest: async ({
      redirectUri,
      payment,
      reversePayment,
      userId,
      connectionId,
      categorisationType,
      scope,
    }) =>
      request(authRequestEndpoint, {
        method: "POST",
        cc: {
          scope: "auth_requests:write",
        },
        body: {
          redirectUri,
          payment,
          reversePayment,
          userId,
          connectionId,
          scope,
          categorisationType,
        },
      }),

    completeAuthRequest: async ({id, authParams}) =>
      request(`${authRequestEndpoint}/${id}`, {
        method: "PATCH",
        cc: {
          scope: "auth_requests:write",
        },
        body: {
          authParams,
        },
      }),

    getAllAuthRequests: async (params) =>
      request(authRequestEndpoint, {
        searchParams: params,
        cc: {
          scope: "auth_requests:read",
        },
      }),

    getAuthRequest: async ({id}) =>
      request(`${authRequestEndpoint}/${id}`, {
        cc: {
          scope: "auth_requests:read",
        },
      }),
  }
}
