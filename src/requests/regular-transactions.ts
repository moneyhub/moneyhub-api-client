import {RequestsParams} from "../request"
import {RegularTransactionsRequests} from "./types/regular-transactions"

export default ({config, request}: RequestsParams): RegularTransactionsRequests => {
  const {resourceServerUrl} = config

  return {
    getRegularTransactions: async ({userId, params}, options) =>
      request(
        `${resourceServerUrl}/regular-transactions`,
        {
          searchParams: params,
          cc: {
            scope: "accounts:read regular_transactions:read transactions:read:all",
            sub: userId,
          },
          options,
        },
      ),

    detectRegularTransactions: async ({userId, accountId}, options) =>
      request(
        `${resourceServerUrl}/regular-transactions/${accountId}/detect`,
        {
          cc: {
            scope: "accounts:read regular_transactions:write regular_transactions:read transactions:read:all",
            sub: userId,
          },
          options,
          method: "POST",
        },
      ),
  }
}
