import {ApiResponse, RequestsParams} from "src/request"
import {RegularTransaction, RegularTransactionSearchParams} from "src/schema/regular-transaction"

export default ({config, request}: RequestsParams) => {
  const {resourceServerUrl} = config

  return {
    getRegularTransactions: async ({userId, params}: {
      userId: string
      params?: RegularTransactionSearchParams
    }): Promise<ApiResponse<RegularTransaction[]>> =>
      request(
        `${resourceServerUrl}/regular-transactions`,
        {
          searchParams: params,
          cc: {
            scope: "accounts:read regular_transactions:read transactions:read:all",
            sub: userId,
          },
        },
      ),
    detectRegularTransactions: async ({userId, accountId}: {
      userId: string
      accountId: string
    }): Promise<ApiResponse<RegularTransaction[]>> =>
      request(
        `${resourceServerUrl}/regular-transactions/${accountId}/detect`,
        {
          cc: {
            scope: "accounts:read regular_transactions:read regular_transactions:write transactions:read:all",
            sub: userId,
          },
          method: "POST",
        },
      ),
  }
}
