import {ApiResponse, ExtraOptions} from "../../request"
import {PaymentsClaims, RecurringPaymentRequest, RecurringPaymentSearchParams, FundsConfirmationRequest, FundsConfirmationResponse} from "../../schema/payment"

export interface RecurringPaymentsRequests {
  getRecurringPayments: (params?: RecurringPaymentSearchParams, options?: ExtraOptions) => Promise<ApiResponse<RecurringPaymentRequest[]>>

  getRecurringPayment: ({
    recurringPaymentId,
  }: {
    recurringPaymentId: string
  }, options?: ExtraOptions) => Promise<ApiResponse<RecurringPaymentRequest>>

  makeRecurringPayment: ({
    recurringPaymentId,
    payment,
  }: {
    recurringPaymentId: string
    payment: PaymentsClaims
  }, options?: ExtraOptions) => Promise<ApiResponse<RecurringPaymentRequest>>

  revokeRecurringPayment: ({
    recurringPaymentId,
  }: {
    recurringPaymentId: string
  }, options?: ExtraOptions) => Promise<number>

  confirmFundsForRecurringPayment: ({
    recurringPaymentId,
    fundsConfirmation,
  }: {
    recurringPaymentId: string
    fundsConfirmation: FundsConfirmationRequest
  }, options?: ExtraOptions) => Promise<ApiResponse<FundsConfirmationResponse>>
}
