import type {Balance, BalancePost} from "./balance"

type InterestType =
  | "fixed"
  | "variable"

type RunningCostPeriod =
  | "month"
  | "year"

export type AccountType =
  | "personal"
  | "business"

export type Type =
  | "cash:current"
  | "savings"
  | "card"
  | "investment"
  | "loan"
  | "mortgage:repayment"
  | "mortgage:interestOnly"
  | "pension"
  | "pension:definedBenefit"
  | "pension:definedContribution"
  | "asset"
  | "properties:residential"
  | "properties:buyToLet"
  | "crypto"

export type IdentificationType =
  | "accountNumber"
  | "savingsRollNumber"
  | "policyNumber"

interface TransactionData {
  count: number
  earliestDate: string
  lastDatE: string
}

interface PerformanceScoreTotals {
  openingBalance: Balance
  currentBalance: Balance
  contributions: number
  withdrawals: number
  nonContributionGrowth: number
  growthRate: number
  annualisedGrowthRate: number
}

interface PerformanceScopeMonths {
  date: string
  openingBalance: number
  nonContributionGrowth: number
  aer: number
}

interface PerformanceScore {
  totals: PerformanceScoreTotals
  months: PerformanceScopeMonths[]
}

interface ProviderAccountIdentification {
  identification: string
  type: IdentificationType
}

export interface AccountDetails {
  AER?: number
  APR?: number
  sortCodeAccountNumber?: string
  iban?: string
  pan?: string
  creditLimit?: number
  endDate?: string
  fixedDate?: string
  interestFreePeriod?: number
  interestType?: InterestType
  monthlyRepayment?: number
  overdraftLimit?: number
  postcode?: string
  runningCost?: number
  runningCostPeriod?: RunningCostPeriod
  term?: number
  yearlyAppreciation?: number
}

export interface Account {
  accountName: string
  currency?: string
  balance: Balance
  transactionData?: TransactionData
  dateModified: string
  id: string
  providerName?: string
  providerReference?: string
  connectionId?: string
  providerId?: string
  accountReference?: string
  accountHolderName?: string
  accountType?: AccountType
  productName?: string
  type: Type
  performanceScore?: PerformanceScore
}

export interface AccountWithDetails extends Account {
  details: AccountDetails
}

export type AccountWriteDetails = Omit<
  AccountDetails,
  "iban" | "pan">

export interface AccountPost {
  accountName: string
  providerName: string
  type: Type
  accountType: AccountType
  balance: BalancePost
  providerAccountIdentifications?: ProviderAccountIdentification[]
  details?: AccountWriteDetails
}

interface AccountBalancePostAmount {
  value: number
}

export interface AccountBalancePost {
  amount: AccountBalancePostAmount
  date: string
}

export type AccountPatch = Pick<AccountPost, "accountName" | "providerName" | "details">
