import type {SearchParams} from "src/request"

export enum PaymentActorType {
  API_PAYEE = "api-payee",
  MH_USER_ACCOUNT = "mh-user-account"
}

export enum PaymentContext {
  OTHER = "Other",
  PARTY_TO_PARTY = "PartyToParty",
  BILL_PAYMENT = "BillPayment"
}

export interface AuthRequestPostPayment {
  amount?: number
  payeeId?: string
  payeeType?: PaymentActorType
  payerId?: string
  payerRef?: string
  payerType?: PaymentActorType
  payerName?: string
  payerEmail?: string
  readRefundAccount?: boolean
  context?: PaymentContext
}

enum PeriodType {
  DAY = "Day",
  WEEK = "Week",
  FORTNIGHT = "Fortnight",
  MONTH = "Month",
  HALF_YEAR = "Half-year",
  YEAR = "Year"
}

enum PeriodAlignment {
  CONSENT = "Consent",
  CALENDAR = "Calendar"
}

interface PeriodicLimit {
  amount?: number
  currency?: string
  periodType?: PeriodType
  periodAlignment?: PeriodAlignment
}

enum RecurringPaymentType {
  SWEEPING = "Sweeping",
  OTHER = "Other"
}

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

enum PaymentStatus {
  IN_PROGRESS = "inProgress",
  PENDING = "pending",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  REJECTED = "rejected",
  ABANDONED = "abandoned",
  ERROR_PAYMENT_SUBMISSION = "error:paymentSubmission",
  ERROR_REDIRECT = "error:redirect",
  ERROR_TOKEN_GRANT = "error:tokenGrant"
}

enum ChargeBearer {
  BORNE_BY_CREDITOR = "BorneByCreditor",
  BORNE_BY_DEBTOR = "BorneByDebtor",
  FOLLOWING_SERVICE_LEVEL = "FollowingServiceLevel",
  SHARED = "Shared"
}

enum ChargeType {
  CHAPS_OUT = "CHAPSOut",
  BALANCE_TRANSFER_OUR = "BalanceTransferOut",
  MONEY_TRANSFER_OUT = "MoneyTransferOut"
}

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

enum Status {
  IN_PROGRESS = "InProgress",
  AWAITING_AUTHORISATION = "AwaitingAuthorisation",
  REJECTED = "Rejected",
  AUTHORISED = "Authorised",
  REVOKED = "Revoked",
  EXPIRED = "Expired"
}

interface RecurringPayment {
  reference: string
  validFromDate?: string
  validToDate?: string
  maximumIndividualAmount: number
  currency: string
  periodicLimits: PeriodicLimit[]
  type: RecurringPaymentType[]
}

export interface RecurringPaymentRequest {
  id: string
  status?: Status
  createdAt: string
  updatedAt?: string
  recurringPayment?: RecurringPayment
}
