import {RequestsParams} from "../request"
import {PayeesRequests} from "./types/payees"

export default ({config, request}: RequestsParams): PayeesRequests => {
  const {identityServiceUrl} = config

  return {
    addPayee: async ({accountNumber, sortCode, name, externalId, userId}, options) =>
      request(`${identityServiceUrl}/payees`, {
        method: "POST",
        body: {accountNumber, sortCode, name, externalId, userId},
        cc: {
          scope: "payee:create",
        },
        options,
      }),

    getPayees: (params = {}, options) =>
      request(`${identityServiceUrl}/payees`, {
        searchParams: params,
        cc: {
          scope: "payee:read",
        },
        options,
      }),

    getPayee: async ({id}, options) =>
      request(`${identityServiceUrl}/payees/${id}`, {
        cc: {
          scope: "payee:read",
        },
        options,
      }),
  }
}
