import type {SearchParams} from "src/request"
import type {Balance} from "./balance"
import type {PaymentActorType, PaymentContext} from "./payment"

interface Payee {
  name?: string
  sortCodeAccountNumber?: string
  iban?: string
  pan?: string
}

type StandingOrderStatus = "Active" | "Inactive"

type FrequencyRepeat =
  | "Daily"
  | "Weekly"
  | "Monthly"
  | "Quarterly"
  | "Yearly"

export interface StandingOrderFrequency {
  repeat: FrequencyRepeat
  day?: number
  week?: number
  month?: number
  onlyWorkDays?: boolean
  region?: string
}

export interface StandingOrder {
  id: string
  status?: StandingOrderStatus
  reference?: string
  frequency: FrequencyRepeat
  numberOfPayments?: number
  firstPaymentDate?: string
  nextPaymentDate?: string
  finalPaymentDate?: string
  firstPaymentAmount?: Balance
  nextPaymentAmount?: Balance
  finalPaymentAmount?: Balance
  currency?: string
}

export interface StandingOrderWithDetail extends StandingOrder {
  payee?: Payee
}

export interface AuthRequestStandingOrderPost {
  payeeId?: string
  payeeType?: PaymentActorType
  payerId?: string
  payerType?: PaymentActorType
  context: PaymentContext
  reference?: string
  numberOfPayments?: number
  firstPaymentDate?: string
  recurringPaymentDate?: string
  finalPaymentDate?: string
  firstPaymentAmount?: number
  recurringPaymentAmount?: number
  finalPaymentAmount?: number
  currency?: string
}

export interface StandingOrderSearchParams extends SearchParams {
  userId?: string
}

type StandingOrderRequestStatus =
  | "InProgress"
  | "InitiationPending"
  | "InitiationFailed"
  | "InitiationCompleted"
  | "Cancelled"

export interface StandingOrderRequest {
  id: string
  status?: StandingOrderRequestStatus
  createdAt: string
  updatedAt?: string
  standingOrder: StandingOrder
}
