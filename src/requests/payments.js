module.exports = ({config, request}) => {
  const {identityUrl} = config

  const getPayment = (id) =>
    request(`${identityUrl}/payments/${id}`, {
      cc: {
        scope: "payment:read",
      },
    })

  return {
    getPayment,
    getPayments: (searchParams = {}) =>
      request(`${identityUrl}/payments`, {
        searchParams,
        cc: {
          scope: "payment:read",
        },
      }),

    getPaymentFromIDToken: async (idToken) => {
      try {
        const payload = JSON.parse(
          Buffer.from(idToken.split(".")[1], "base64").toString(),
        )
        const paymentId = payload["mh:payment"]
        return getPayment(paymentId)
      } catch (e) {
        throw new Error(
          "Error retrieving payment from passed in ID Token: " + e.message,
        )
      }
    },
  }
}
