module.exports = ({config, request}) => {
  const {resourceServerUrl} = config

  return {
    getRegularTransactions: async ({userId, params}) =>
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
  }
}
