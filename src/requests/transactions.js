module.exports = ({config, request}) => {
  const {resourceServerUrl} = config

  return {
    getTransactions: ({userId, params}) =>
      request(`${resourceServerUrl}/transactions`, {
        searchParams: params,
        cc: {
          scope: "transactions:read:all",
          sub: userId,
        },
      }),
  }
}
