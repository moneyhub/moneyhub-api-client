module.exports = ({config, request}) => {
  const {identityUrl} = config

  return {
    addPayee: async ({accountNumber, sortCode, name}) =>
      request(`${identityUrl}/payees`, {
        method: "POST",
        body: {accountNumber, sortCode, name},
        cc: {
          scope: "payee:create",
        },
      }),

    getPayees: (searchParams = {}) =>
      request(`${identityUrl}/payees`, {
        searchParams,
        cc: {
          scope: "payee:read",
        },
      }),

    getPayee: async (id) =>
      request(`${identityUrl}/payees/${id}`, {
        cc: {
          scope: "payee:read",
        },
      }),
  }
}
