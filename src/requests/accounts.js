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
  }
}
