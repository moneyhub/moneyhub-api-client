import {ApiResponse, ExtraOptions, RequestsParams} from "../request"
import {PaymentsRequests} from "./types/payments"
import {Payment} from "../schema/payment"

export default ({config, request}: RequestsParams): PaymentsRequests => {
  const {identityServiceUrl} = config

  const getPayment = ({id}: {id: string}, options?: ExtraOptions): Promise<ApiResponse<Payment>> =>
    request(`${identityServiceUrl}/payments/${id}`, {
      cc: {
        scope: "payment:read",
      },
      options,
    })

  return {
    getPayment,
    getPayments: (params = {}, options) =>
      request(`${identityServiceUrl}/payments`, {
        searchParams: params,
        cc: {
          scope: "payment:read",
        },
        options,
      }),

    getPaymentFromIDToken: async ({idToken}, options) => {
      try {
        const payload = JSON.parse(
          Buffer.from(idToken.split(".")[1], "base64").toString(),
        )
        const paymentId = payload["mh:payment"]
        return getPayment({id: paymentId}, options)
      } catch (e: any) {
        throw new Error(
          "Error retrieving payment from passed in ID Token: " + e.message,
        )
      }
    },
  }
}
