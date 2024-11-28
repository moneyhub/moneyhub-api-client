import type {SearchParams} from "../request"
import {RequestPayer} from "./payee"

export type PaymentActorType = "api-payee" | "mh-user-account"

export type PayerType = "api-payer" | "mh-user-account"

export type PaymentContext = "Other" | "PartyToParty" | "BillPayment"

export interface AuthRequestPostPayment {
  amount: number
  payeeId: string
  payeeRef: string
  payeeType?: PaymentActorType
  payerId?: string
  payerRef: string
  payerType?: PayerType
  payer?: RequestPayer
  payerName?: string
  payerEmail?: string
  readRefundAccount?: boolean
  context?: PaymentContext
}

type PeriodType = "Day" | "Week" | "Fortnight" | "Month" | "Half-year" | "Year"

type PeriodAlignment = "Consent" | "Calendar"

interface PeriodicLimit {
  amount?: number
  currency?: string
  periodType?: PeriodType
  periodAlignment?: PeriodAlignment
}

type RecurringPaymentType = "Sweeping" | "Other"

export interface AuthRequestPostRecurringPayment {
  payeeId?: string
  payeeType?: PaymentActorType
  payerId?: string
  payerType?: PaymentActorType
  context?: PaymentContext
  reference?: string
  validFromDate?: string
  validToDate?: string
  maximumIndividualAmount?: number
  currency?: string
  periodicLimits?: PeriodicLimit[]
  type: RecurringPaymentType[]
}

export interface AuthRequestPostReversePayment {
  paymentId?: string
  amount?: number
}

export interface PaymentSearchParams extends SearchParams {
  userId?: string
  payeeId?: string
  startDate?: string
  endDate?: string
}

type PaymentStatus =
  | "inProgress"
  | "pending"
  | "completed"
  | "cancelled"
  | "rejected"
  | "abandoned"
  | "error:paymentSubmission"
  | "error:redirect"
  | "error:tokenGrant"

type ChargeBearer =
  | "BorneByCreditor"
  | "BorneByDebtor"
  | "FollowingServiceLevel"
  | "Shared"

type ChargeType = "CHAPSOut" | "BalanceTransferOut" | "MoneyTransferOut"

interface Charge {
  bearer?: ChargeBearer
  type?: ChargeType
  amount?: number
  currency?: string
}

export interface Payment {
  id: string
  amount: number
  payeeId: string
  payeeRef: string
  payeeType: PaymentActorType
  payerId?: string
  payerRef: string
  payerType?: PaymentActorType
  payerName?: string
  payerEmail?: string
  currency: string
  isReversible: boolean
  status: PaymentStatus
  providerStatus?: string
  paymentSubmissionId?: string
  charges: Charge[]
  initiatedAt: string
  finalisedAt?: string
}

export interface PaymentsClaims {
  amount?: number
  payeeId?: string
  payeeRef?: string
  payeeType?: PaymentActorType
  payerId?: string
  payerRef?: string
  payerType?: PaymentActorType
  payerName?: string
  payerEmail?: string
  readRefundAccoun?: boolean
}

export interface RecurringPaymentSearchParams extends SearchParams {
  userId?: string
}

export interface RecurringPayment{
  reference: string
  validFromDate?: string
  validToDate?: string
  maximumIndividualAmount: number
  currency: string
  periodicLimits: PeriodicLimit[]
  type: RecurringPaymentType[]
}

type RecurringPaymentStatus =
  | "Pending"
  | "Rejected"
  | "AcceptedSettlementInProcess"
  | "AcceptedSettlementCompleted"
  | "AcceptedWithoutPosting"
  | "AcceptedCreditSettlementCompleted"

export interface RecurringPaymentRequest {
  paymentSubmissionId: string
  providerStatus: RecurringPaymentStatus
  status: PaymentStatus
  submittedAt: string
  authRequestId: string
  revokedAt?: string
}
