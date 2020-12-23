module.exports = ({config, request}) => {
  const {resourceServerUrl} = config

  return {
    getTransactions: (userId, searchParams) =>
      request(`${resourceServerUrl}/transactions`, {
        searchParams,
        cc: {
          scope: "transactions:read:all",
          sub: userId,
        },
      }),
  }
}
