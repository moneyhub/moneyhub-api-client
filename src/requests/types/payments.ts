import {ApiResponse, ExtraOptions} from "../../request"
import {Payment, PaymentSearchParams} from "../../schema/payment"

export interface PaymentsRequests {
  getPayment: ({id}: {id: string}, options?: ExtraOptions) => Promise<ApiResponse<Payment>>
  getPayments: (params?: PaymentSearchParams, options?: ExtraOptions) => Promise<ApiResponse<Payment[]>>
  getPaymentFromIDToken: ({idToken}: {idToken: string}, options?: ExtraOptions) => Promise<ApiResponse<Payment>>
}
