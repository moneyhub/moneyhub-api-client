module.exports = ({config, request}) => {
  const {identityServiceUrl} = config

  return {
    addPayee: async ({accountNumber, sortCode, name}) =>
      request(`${identityServiceUrl}/payees`, {
        method: "POST",
        body: {accountNumber, sortCode, name},
        cc: {
          scope: "payee:create",
        },
      }),

    getPayees: (searchParams = {}) =>
      request(`${identityServiceUrl}/payees`, {
        searchParams,
        cc: {
          scope: "payee:read",
        },
      }),

    getPayee: async ({id}) =>
      request(`${identityServiceUrl}/payees/${id}`, {
        cc: {
          scope: "payee:read",
        },
      }),
  }
}
