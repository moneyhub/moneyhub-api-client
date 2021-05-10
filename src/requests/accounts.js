module.exports = ({config, request}) => {
  const {resourceServerUrl} = config

  return {
    getAccounts: async ({userId, params = {}}) =>
      request(`${resourceServerUrl}/accounts`, {
        searchParams: params,
        cc: {
          scope: "accounts:read",
          sub: userId,
        },
      }),


    getAccountsWithDetails: async ({userId, params = {}}) =>
      request(`${resourceServerUrl}/accounts`, {
        searchParams: params,
        cc: {
          scope: "accounts:read accounts_details:read",
          sub: userId,
        },
      }),

    getAccount: async ({userId, accountId}) =>
      request(`${resourceServerUrl}/accounts/${accountId}`, {
        cc: {
          scope: "accounts:read",
          sub: userId,
        },
      }),

    getAccountBalances: async ({userId, accountId}) =>
      request(`${resourceServerUrl}/accounts/${accountId}/balances`, {
        cc: {
          scope: "accounts:read",
          sub: userId,
        },
      }),

    getAccountWithDetails: async ({userId, accountId}) =>
      request(`${resourceServerUrl}/accounts/${accountId}`, {
        cc: {
          scope: "accounts:read accounts_details:read",
          sub: userId,
        },
      }),

    getAccountHoldings: async ({userId, accountId}) =>
      request(`${resourceServerUrl}/accounts/${accountId}/holdings`, {
        cc: {
          scope: "accounts:read",
          sub: userId,
        },
      }),

    getAccountHoldingsWithMatches: async ({userId, accountId}) =>
      request(
        `${resourceServerUrl}/accounts/${accountId}/holdings-with-matches`,
        {
          cc: {
            scope: "accounts:read",
            sub: userId,
          },
        },
      ),

    getAccountHolding: async ({userId, accountId, holdingId}) =>
      request(
        `${resourceServerUrl}/accounts/${accountId}/holdings/${holdingId}`,
        {
          cc: {
            scope: "accounts:read",
            sub: userId,
          },
        },
      ),

    getAccountCounterparties: async ({userId, accountId}) =>
      request(`${resourceServerUrl}/accounts/${accountId}/counterparties`, {
        cc: {
          scope: "accounts:read transactions:read:all",
          sub: userId,
        },
      }),

    getAccountRecurringTransactions: async ({userId, accountId}) =>
      request(
        `${resourceServerUrl}/accounts/${accountId}/recurring-transactions`,
        {
          method: "POST",
          cc: {
            scope: "accounts:read transactions:read:all",
            sub: userId,
          },
        },
      ),

    getAccountStandingOrders: async ({userId, accountId}) =>
      request(
        `${resourceServerUrl}/accounts/${accountId}/standing-orders`,
        {
          cc: {
            scope: "accounts:read standing_orders:read",
            sub: userId,
          },
        },
      ),

    getAccountStandingOrdersWithDetail: async ({userId, accountId}) =>
      request(
        `${resourceServerUrl}/accounts/${accountId}/standing-orders`,
        {
          cc: {
            scope: "accounts:read standing_orders_detail:read",
            sub: userId,
          },
        },
      ),

    createAccount: async ({userId, account}) =>
      request(
        `${resourceServerUrl}/accounts`,
        {
          method: "POST",
          cc: {
            scope: "accounts:read accounts:write:all",
            sub: userId,
          },
          body: account
        },
      ),

    deleteAccount: async ({userId, accountId}) =>
      request(
        `${resourceServerUrl}/accounts/${accountId}`,
        {
          method: "DELETE",
          cc: {
            scope: "accounts:write:all",
            sub: userId,
          },
          returnStatus: true,
        },
      ),
  }
}
