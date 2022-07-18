import type {Balance} from "./balance"

enum InterestType {
  FIXED = "fixed",
  VARIABLE = "variable"
}

enum RunningCostPeriod {
  MONTH = "month",
  YEAR = "year"
}

export enum AccountType {
  PERSONAL = "personal",
  BUSINESS = "business"
}

enum Type {
  CASH_CURRENT = "cash:current",
  SAVINGS = "savings",
  CARD = "card",
  INVESTMENT = "investment",
  LOAN = "loan",
  MORTGAGE_REPAYMENT = "mortgage:repayment",
  MORTGAGE_INTEREST_ONLY = "mortgage:interestOnly",
  PENSION = "pension",
  PENSION_DEFINED_BENEFIT = "pension:definedBenefit",
  PENSION_DEFINED_CONTRIBUTION = "pension:definedContribution",
  ASSET = "asset",
  PROPERTIES_RESIDENTIAL = "properties:residential",
  PROPERTIES_BUT_TO_LET = "properties:buyToLet",
  CRYPTO = "crypto"
}

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

export interface AccountPost {
  accountName: string
  providerName: string
  type: Type
  accountType: AccountType
  balance: Balance
  details?: AccountDetails
}
