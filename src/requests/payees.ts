import {RequestsParams} from "src/request"
import {PayeesRequests} from "./types/payees"

export default ({config, request}: RequestsParams): PayeesRequests => {
  const {identityServiceUrl} = config

  return {
    addPayee: async ({accountNumber, sortCode, name, externalId, userId}) =>
      request(`${identityServiceUrl}/payees`, {
        method: "POST",
        body: {accountNumber, sortCode, name, externalId, userId},
        cc: {
          scope: "payee:create",
        },
      }),

    getPayees: (params = {}) =>
      request(`${identityServiceUrl}/payees`, {
        searchParams: params,
        cc: {
          scope: "payee:read",
        },
      }),

    getPayee: async ({id}) =>
      request(`${identityServiceUrl}/payees/${id}`, {
        cc: {
          scope: "payee:read",
        },
      }),
  }
}
