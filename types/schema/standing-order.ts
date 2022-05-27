import {SearchParams} from "../request"
import type {Balance} from "./balance"
import type {PaymentActorType, PaymentContext} from "./payment"

interface Payee {
  name?: string
  sortCodeAccountNumber?: string
  iban?: string
  pan?: string
}

enum Status {
  ACTIVE = "Active",
  INACTIVE = "Inactive"
}

enum FrequencyRepeat {
  DAILY = "Daily",
  WEEKLY = "Weekly",
  MONTHLY = "Monthly",
  QUARTERLY = "Quarterly",
  YEARLY = "Yearly"
}

export interface Frequency {
  repeat: FrequencyRepeat
  day?: number
  week?: number
  month?: number
  onlyWorkDays?: boolean
  region?: string
}

export interface StandingOrder {
  id: string
  status?: Status
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

enum StandingOrderRequestStatus {
  IN_PROGRESS = "InProgress",
  INITIATION_PENDING = "InitiationPending",
  INITIATION_FAILED = "InitiationFailed",
  INITIATION_COMPLETED = "InitiationCompleted",
  CANCELLED = "Cancelled"
}

export interface StandingOrderRequest {
  id: string
  status?: StandingOrderRequestStatus
  createdAt: string
  updatedAt?: string
  standingOrder: StandingOrder
}
