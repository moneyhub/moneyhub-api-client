import {RequestsParams} from "../request"
import {RecurringPaymentsRequests} from "./types/recurring-payments"

export default ({config, request}: RequestsParams): RecurringPaymentsRequests => {
  const {identityServiceUrl} = config

  return {
    getRecurringPayments: async (params = {}, options) =>
      request(`${identityServiceUrl}/recurring-payments`, {
        searchParams: params,
        cc: {
          scope: "recurring_payment:read",
        },
        options,
      }),

    getRecurringPayment: async ({recurringPaymentId}, options) =>
      request(`${identityServiceUrl}/recurring-payments/${recurringPaymentId}`, {
        cc: {
          scope: "recurring_payment:read",
        },
        options,
      }),

    makeRecurringPayment: async ({recurringPaymentId, payment}, options) =>
      request(`${identityServiceUrl}/recurring-payments/${recurringPaymentId}/pay`, {
        method: "POST",
        body: payment,
        cc: {
          scope: "recurring_payment:create",
        },
        options,
      }),

    revokeRecurringPayment: async ({recurringPaymentId}, options) =>
      request(`${identityServiceUrl}/recurring-payments/${recurringPaymentId}`, {
        method: "DELETE",
        cc: {
          scope: "recurring_payment:create",
        },
        options,
      }),

    confirmFundsForRecurringPayment: async ({recurringPaymentId, fundsConfirmation}, options) =>
      request(`${identityServiceUrl}/recurring-payments/${recurringPaymentId}/funds-confirmation`, {
        method: "POST",
        body: fundsConfirmation,
        cc: {
          scope: "recurring_payment:funds_confirmation",
        },
        options,
      }),
  }
}
