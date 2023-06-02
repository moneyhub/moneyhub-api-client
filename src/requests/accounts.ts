import type {RequestsParams} from "../request"
import type {AccountsRequests} from "./types/accounts"

export default ({
  config,
  request,
}: RequestsParams): AccountsRequests => {
  const {resourceServerUrl} = config

  return {
    getAccounts: async ({userId, params = {}}, options) =>
      request(`${resourceServerUrl}/accounts`, {
        searchParams: params,
        cc: {
          scope: "accounts:read",
          sub: userId,
        },
        options,
      }),

    getAccountsWithDetails: async ({userId, params = {}}, options) =>
      request(`${resourceServerUrl}/accounts`, {
        searchParams: params,
        cc: {
          scope: "accounts:read accounts_details:read",
          sub: userId,
        },
        options,
      }),

    getAccountsList: async ({userId, params = {}}, options) =>
      request(`${resourceServerUrl}/accounts-list`, {
        searchParams: params,
        cc: {
          scope: "accounts:read",
          sub: userId,
        },
        options,
      }),

    getAccountsListWithDetails: async ({userId, params = {}}, options) =>
      request(`${resourceServerUrl}/accounts-list`, {
        searchParams: params,
        cc: {
          scope: "accounts:read accounts_details:read",
          sub: userId,
        },
        options,
      }),

    getAccount: async ({userId, accountId}, options) =>
      request(`${resourceServerUrl}/accounts/${accountId}`, {
        cc: {
          scope: "accounts:read",
          sub: userId,
        },
        options,
      }),

    getAccountBalances: async ({userId, accountId}, options) =>
      request(`${resourceServerUrl}/accounts/${accountId}/balances`, {
        cc: {
          scope: "accounts:read",
          sub: userId,
        },
        options,
      }),

    getAccountWithDetails: async ({userId, accountId}, options) =>
      request(`${resourceServerUrl}/accounts/${accountId}`, {
        cc: {
          scope: "accounts:read accounts_details:read",
          sub: userId,
        },
        options,
      }),

    getAccountHoldings: async ({userId, accountId}, options) =>
      request(`${resourceServerUrl}/accounts/${accountId}/holdings`, {
        cc: {
          scope: "accounts:read",
          sub: userId,
        },
        options,
      }),

    getAccountHoldingsWithMatches: async ({userId, accountId}, options) =>
      request(
        `${resourceServerUrl}/accounts/${accountId}/holdings-with-matches`,
        {
          cc: {
            scope: "accounts:read",
            sub: userId,
          },
          options,
        },
      ),

    getAccountHolding: async ({userId, accountId, holdingId}, options) =>
      request(
        `${resourceServerUrl}/accounts/${accountId}/holdings/${holdingId}`,
        {
          cc: {
            scope: "accounts:read",
            sub: userId,
          },
          options,
        },
      ),

    getAccountCounterparties: async ({userId, accountId, params = {}}, options) =>
      request(`${resourceServerUrl}/accounts/${accountId}/counterparties`, {
        searchParams: params,
        cc: {
          scope: "accounts:read transactions:read:all",
          sub: userId,
        },
        options,
      }),

    getAccountRecurringTransactions: async ({userId, accountId}, options) =>
      request(
        `${resourceServerUrl}/accounts/${accountId}/recurring-transactions`,
        {
          method: "POST",
          cc: {
            scope: "accounts:read transactions:read:all",
            sub: userId,
          },
          options,
        },
      ),

    getAccountStandingOrders: async ({userId, accountId}, options) =>
      request(`${resourceServerUrl}/accounts/${accountId}/standing-orders`, {
        cc: {
          scope: "accounts:read standing_orders:read",
          sub: userId,
        },
        options,
      }),

    getAccountStandingOrdersWithDetail: async ({userId, accountId}, options) =>
      request(`${resourceServerUrl}/accounts/${accountId}/standing-orders`, {
        cc: {
          scope: "accounts:read standing_orders_detail:read",
          sub: userId,
        },
        options,
      }),

    createAccount: async ({userId, account}, options) =>
      request(`${resourceServerUrl}/accounts`, {
        method: "POST",
        cc: {
          scope: "accounts:read accounts:write:all",
          sub: userId,
        },
        body: account,
        options,
      }),

    deleteAccount: async ({userId, accountId}, options) =>
      request(`${resourceServerUrl}/accounts/${accountId}`, {
        method: "DELETE",
        cc: {
          scope: "accounts:write:all",
          sub: userId,
        },
        returnStatus: true,
        options,
      }),

    addAccountBalance: async ({userId, accountId, balance}, options) =>
      request(`${resourceServerUrl}/accounts/${accountId}/balances`, {
        method: "POST",
        cc: {
          scope: "accounts:read accounts:write:all",
          sub: userId,
        },
        body: balance,
        options,
      }),

    updateAccount: async ({userId, accountId, account}, options) =>
      request(`${resourceServerUrl}/accounts/${accountId}`, {
        method: "PATCH",
        cc: {
          scope: "accounts:read accounts:write:all",
          sub: userId,
        },
        body: account,
        options,
      }),
  }
}
