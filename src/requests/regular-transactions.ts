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
  }
}
