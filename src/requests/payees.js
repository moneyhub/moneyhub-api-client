module.exports = ({config, request}) => {
  const {identityServiceUrl} = config

  return {
    addPayee: async ({accountNumber, sortCode, name, externalId}) =>
      request(`${identityServiceUrl}/payees`, {
        method: "POST",
        body: {accountNumber, sortCode, name, externalId},
        cc: {
          scope: "payee:create",
        },
      }),

    getPayees: (params = {}) =>
      request(`${identityServiceUrl}/payees`, {
        searchParams: params,
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
