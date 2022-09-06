import {ApiResponse} from "../../request"
import {Payment, PaymentSearchParams} from "../../schema/payment"

export interface PaymentsRequests {
  getPayment: ({id}: {id: string}) => Promise<ApiResponse<Payment>>
  getPayments: (params?: PaymentSearchParams) => Promise<ApiResponse<Payment[]>>
  getPaymentFromIDToken: ({idToken}: {idToken: string}) => Promise<ApiResponse<Payment>>
}
