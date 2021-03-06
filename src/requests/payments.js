module.exports = ({config, request}) => {
  const {identityServiceUrl} = config

  const getPayment = ({id}) =>
    request(`${identityServiceUrl}/payments/${id}`, {
      cc: {
        scope: "payment:read",
      },
    })

  return {
    getPayment,
    getPayments: (params = {}) =>
      request(`${identityServiceUrl}/payments`, {
        searchParams: params,
        cc: {
          scope: "payment:read",
        },
      }),

    getPaymentFromIDToken: async ({idToken}) => {
      try {
        const payload = JSON.parse(
          Buffer.from(idToken.split(".")[1], "base64").toString(),
        )
        const paymentId = payload["mh:payment"]
        return getPayment({id: paymentId})
      } catch (e) {
        throw new Error(
          "Error retrieving payment from passed in ID Token: " + e.message,
        )
      }
    },
  }
}
