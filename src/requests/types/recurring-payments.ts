import {ApiResponse} from "src/request"
import {PaymentsClaims, RecurringPaymentRequest, RecurringPaymentSearchParams} from "src/schema/payment"

export interface RecurringPaymentsRequests {
  getRecurringPayments: (params?: RecurringPaymentSearchParams) => Promise<ApiResponse<RecurringPaymentRequest[]>>

  getRecurringPayment: ({
    recurringPaymentId,
  }: {
    recurringPaymentId: string
  }) => Promise<ApiResponse<RecurringPaymentRequest>>

  makeRecurringPayment: ({
    recurringPaymentId,
    payment,
  }: {
    recurringPaymentId: string
    payment: PaymentsClaims
  }) => Promise<ApiResponse<RecurringPaymentRequest>>

  revokeRecurringPayment: ({
    recurringPaymentId,
  }: {
    recurringPaymentId: string
  }) => Promise<number>
}
