import {RequestsParams} from "src/request"
import {AuthRequestsRequests} from "./types/auth-requests"

export default ({
  config,
  request,
}: RequestsParams): AuthRequestsRequests => {
  const {identityServiceUrl} = config
  const authRequestEndpoint = identityServiceUrl + "/auth-requests"

  return {
    createAuthRequest: async ({
      redirectUri,
      userId,
      scope,
      connectionId,
      payment,
      standingOrder,
      recurringPayment,
      reversePayment,
      categorisationType,
      benefitsCheck,
      counterpartiesCheck,
      permissions,
      expirationDateTime,
      transactionsFromDateTime,
      sync,
    }) =>
      request(authRequestEndpoint, {
        method: "POST",
        cc: {
          scope: "auth_requests:write",
        },
        body: {
          redirectUri,
          userId,
          scope,
          connectionId,
          payment,
          standingOrder,
          recurringPayment,
          reversePayment,
          categorisationType,
          benefitsCheck,
          counterpartiesCheck,
          permissions,
          expirationDateTime,
          transactionsFromDateTime,
          sync,
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
