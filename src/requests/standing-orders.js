module.exports = ({config, request}) => {
  const {identityServiceUrl} = config

  const getStandingOrder = ({id}) =>
    request(`${identityServiceUrl}/standing-orders/${id}`, {
      cc: {
        scope: "payment:read",
      },
    })

  return {
    getStandingOrder,
    getStandingOrders: (params = {}) =>
      request(`${identityServiceUrl}/standing-orders`, {
        searchParams: params,
        cc: {
          scope: "payment:read",
        },
      }),
  }
}
