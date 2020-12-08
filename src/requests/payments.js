module.exports = ({config, request}) => {
  const {identityUrl} = config

  return {
    getPayments: (searchParams = {}) =>
      request(`${identityUrl}/payments`, {
        searchParams,
        cc: {
          scope: "payment:read",
        },
      }),

    getPayment: (id) =>
      request(`${identityUrl}/payments/${id}`, {
        cc: {
          scope: "payment:read",
        },
      }),
  }
}
