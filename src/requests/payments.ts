import { PaymentsRequests, PaymentsRequestsParams } from "../types/requests/payments";

export default ({ config, request }: PaymentsRequestsParams): PaymentsRequests => {
  const { identityServiceUrl } = config;

  const getPayment = ({ id }: { id: string }) =>
    request(`${identityServiceUrl}/payments/${id}`, {
      cc: {
        scope: "payment:read",
      },
    });
  return {
    getPayment,
    getPayments: (params = {}) =>
      request(`${identityServiceUrl}/payments`, {
        searchParams: params,
        cc: {
          scope: "payment:read",
        },
      }),

    getPaymentFromIDToken: async ({ idToken }) => {
      try {
        const payload = JSON.parse(Buffer.from(idToken.split(".")[1], "base64").toString());
        const paymentId = payload["mh:payment"];
        return getPayment({ id: paymentId });
      } catch (e) {
        const errorMessage = (e as Error).message;
        throw new Error("Error retrieving payment from passed in ID Token: " + errorMessage);
      }
    },
  };
};
