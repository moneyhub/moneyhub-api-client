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
    getTransaction: ({userId, transactionId}) =>
      request(`${resourceServerUrl}/transactions/${transactionId}`, {
        cc: {
          scope: "transactions:read:all",
          sub: userId,
        },
      }),
    addTransaction: ({userId, transaction}) =>
      request(`${resourceServerUrl}/transactions`, {
        method: "POST",
        cc: {
          scope: "transactions:read:all transactions:write:all",
          sub: userId,
        },
        body: transaction
      }),
    updateTransaction: ({userId, transactionId, transaction}) =>
      request(`${resourceServerUrl}/transactions/${transactionId}`, {
        method: "PATCH",
        cc: {
          scope: "transactions:read:all transactions:write:all",
          sub: userId,
        },
        body: transaction
      }),
    deleteTransaction: ({userId, transactionId}) =>
      request(`${resourceServerUrl}/transactions/${transactionId}`, {
        method: "DELETE",
        cc: {
          scope: "transactions:write:all",
          sub: userId,
        },
        returnStatus: true
      }),
  }
}
