module.exports = ({config, request}) => {
  const {identityServiceUrl} = config

  return {
    getRecurringPayments: async (params = {}) =>
      request(`${identityServiceUrl}/recurring-payments`, {
        searchParams: params,
        cc: {
          scope: "recurring_payment:read",
        },
      }),

    getRecurringPayment: async ({recurringPaymentId}) =>
      request(`${identityServiceUrl}/recurring-payments/${recurringPaymentId}`, {
        cc: {
          scope: "recurring_payment:read",
        },
      }),

    makeRecurringPayment: async ({recurringPaymentId, payment}) =>
      request(`${identityServiceUrl}/recurring-payments/${recurringPaymentId}/pay`, {
        method: "POST",
        body: payment,
        cc: {
          scope: "recurring_payment:create",
        },
      }),
  }
}
