import {RequestsParams} from "../request"
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
      customerIpAddress,
      customerLastLoggedTime,
    }, options) =>
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
          transactionFromDateTime: transactionsFromDateTime,
          sync,
          customerIpAddress,
          customerLastLoggedTime,
        },
        options,
      }),

    completeAuthRequest: async ({id, authParams}, options) =>
      request(`${authRequestEndpoint}/${id}`, {
        method: "PATCH",
        cc: {
          scope: "auth_requests:write",
        },
        body: {
          authParams,
        },
        options,
      }),

    getAllAuthRequests: async (params, options) =>
      request(authRequestEndpoint, {
        searchParams: params,
        cc: {
          scope: "auth_requests:read",
        },
        options,
      }),

    getAuthRequest: async ({id}, options) =>
      request(`${authRequestEndpoint}/${id}`, {
        cc: {
          scope: "auth_requests:read",
        },
        options,
      }),
  }
}
