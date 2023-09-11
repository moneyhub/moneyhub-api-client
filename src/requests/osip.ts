import type {RequestsParams} from "../request"
import type {OsipRequests} from "./types/osip"

export default ({
  config,
  request,
}: RequestsParams): OsipRequests => {
  const {osipResourceServerUrl} = config

  return {
    getOsipAccounts: async ({userId, params = {}}, options) =>
      request(`${osipResourceServerUrl}/accounts`, {
        searchParams: params,
        cc: {
          scope: "osip:read",
          sub: userId,
        },
        options,
      }),

    getOsipAccount: async ({userId, accountId}, options) =>
      request(`${osipResourceServerUrl}/accounts/${accountId}`, {
        cc: {
          scope: "osip:read",
          sub: userId,
        },
        options,
      }),

    getOsipAccountHoldings: async ({userId, accountId}, options) =>
      request(`${osipResourceServerUrl}/accounts/${accountId}/holdings`, {
        cc: {
          scope: "osip:read",
          sub: userId,
        },
        options,
      }),

    getOsipAccountTransactions: async ({userId, accountId}, options) =>
      request(
        `${osipResourceServerUrl}/accounts/${accountId}/transactions`,
        {
          cc: {
            scope: "osip:read",
            sub: userId,
          },
          options,
        },
      ),
  }
}
