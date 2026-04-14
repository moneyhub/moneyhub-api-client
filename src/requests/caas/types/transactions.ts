import {ApiResponse, ExtraOptions} from "../../../request"

export interface CaasEnrichTransactionsResponse {
  data: CaasTransaction[]
  meta: {
    errorTransactionIds: string[]
  }
}

export type CaasAccountType =
  | "cash"
  | "card"
  | "savings"
  | "investment"
  | "loan"
  | "mortgage"
  | "pension"

export type CaasTransactionStatus = "pending" | "posted"

export type CaasL1CategoryGroupId =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12"
  | "13"
  | "14"
  | "15"
  | "16"

export type CaasL1CategoryGroupName =
  | "bills"
  | "business"
  | "cash"
  | "entertainment"
  | "gifts"
  | "shopping"
  | "health"
  | "household"
  | "income"
  | "other"
  | "rent"
  | "taxes"
  | "transfers"
  | "transport"
  | "repayments"
  | "mixed"

export type CaasL1CategoryType =
  | "expense"
  | "income"
  | "transfer"
  | "deferred"
  | "mixed"
  | "uncategorize"

export type CaasL2CategoryId =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12"
  | "13"
  | "14"
  | "15"
  | "16"
  | "17"
  | "18"
  | "19"
  | "20"
  | "21"
  | "22"
  | "23"
  | "24"
  | "25"
  | "26"
  | "27"
  | "28"
  | "29"
  | "30"
  | "31"
  | "32"
  | "33"
  | "34"
  | "35"
  | "36"
  | "37"
  | "38"
  | "39"
  | "40"
  | "41"
  | "42"
  | "43"
  | "44"
  | "45"
  | "92"
  | "94"
  | "96"
  | "98"
  | "100"
  | "102"
  | "104"
  | "106"
  | "108"
  | "110"
  | "112"
  | "114"
  | "115"
  | "116"
  | "117"
  | "118"
  | "119"
  | "120"
  | "255"
  | "mixed"

export type CaasL2CategoryName =
  | "automotive"
  | "charitable"
  | "clothing"
  | "education"
  | "entertainment"
  | "gasoline"
  | "groceries"
  | "healthcare"
  | "home-maintenance"
  | "home-improvement"
  | "insurance"
  | "cable"
  | "online"
  | "loans"
  | "mortgages"
  | "other"
  | "personal"
  | "rent"
  | "eating-out"
  | "travel"
  | "service"
  | "atm"
  | "cheques"
  | "hobbies"
  | "other-bills"
  | "telephone"
  | "utilities"
  | "pets"
  | "electronics"
  | "general"
  | "office-supplies"
  | "child"
  | "taxes"
  | "gifts"
  | "advertising"
  | "business"
  | "postage"
  | "printing"
  | "dues"
  | "office-maintenance"
  | "wages"
  | "gambling"
  | "transfers"
  | "savings"
  | "credit"
  | "securities"
  | "other-income"
  | "paychecks"
  | "investment"
  | "retirement"
  | "interest"
  | "expense"
  | "benefits"
  | "rental-income"
  | "pension-contributions"
  | "pension-withdrawals"
  | "investments"
  | "services"
  | "dividends"
  | "mixed"
  | "consulting"
  | "deposits"
  | "sales"
  | "rewards"
  | "uncategorized"

export type CaasL4LoanType =
  | "Unsecured"
  | "Secured"
  | "Buy Now Pay Later"
  | "High Cost Short Term Credit"
  | "Debt Collection Agency/Debt Management Plan"

export interface CaasTransactionInput {
  userId?: string
  accountId: string
  transactionId: string
  accountType: CaasAccountType
  date: string
  status: CaasTransactionStatus
  description: string
  amount: number
  currency?: string
  txCode?: string
  merchantCategoryCode?: string
  cardPresent?: boolean
  meta?: Record<string, any>
}

export interface CaasTransactionsRequests {
  caasPatchTransaction: (
    {
      accountId,
      transactionId,
      l2CategoryId,
    }: {
      accountId: string
      transactionId: string
      l2CategoryId: string
    },
    options?: ExtraOptions,
  ) => Promise<ApiResponse<CaasTransaction[]>>
  caasEnrichTransactions: (
    {
      transactions,
    }: {
      transactions: CaasTransactionInput[]
    },
    options?: ExtraOptions,
  ) => Promise<CaasEnrichTransactionsResponse>
  caasGetTransactions: (
    {
      userId,
      accountId,
      limit,
    }: {
      userId?: string
      accountId: string
      limit?: number
    },
    options?: ExtraOptions,
  ) => Promise<ApiResponse<CaasTransaction[]>>
  caasDeleteTransaction: (
    {
      accountId,
      transactionId,
    }: {
      accountId: string
      transactionId: string
    },
    options?: ExtraOptions,
  ) => Promise<void>
}

export interface CaasTransaction {
  userId?: string
  accountId: string
  transactionId: string
  accountType: CaasAccountType
  txCode?: string
  date: string
  status: CaasTransactionStatus
  description: string
  amount: number
  currency: string
  merchantCategoryCode?: string
  cardPresent?: boolean
  meta?: Record<string, any>
  mhInsights: CaasTransactionInsights
}

export interface CaasTransactionInsights {
  l1CategoryGroupId?: CaasL1CategoryGroupId
  l1CategoryGroupName?: CaasL1CategoryGroupName
  l1CategoryType?: CaasL1CategoryType
  l2CategoryId: CaasL2CategoryId
  l2CategoryName?: CaasL2CategoryName
  l3Counterparty?: CaasCounterparty
  geotags?: CaasGeotag[]
  cardPresent: boolean
  timestampCreated: string
  timestampIngress: string
  timestampEgress: string
}

export interface CaasCounterparty {
  l3CounterpartyId: string
  l3CounterpartyName?: string
  parentId?: string | null
  parentName?: string | null
  fullCompanyName?: string
  logoUrl?: string
  website?: string
  registeredLocation?: string
  l3CounterpartyCategory?: string
  l2CategoryName?: string
  l4LoanType?: CaasL4LoanType
}

export interface CaasGeotag {
  geotagId: string
  counterpartyName?: string
  counterpartyLabel?: string
  houseNumber?: string
  street?: string
  neighbourhood?: string
  locality?: string
  city?: string
  county?: string
  region?: string
  postcode?: string
  latitude?: number
  longitude?: number
  l3CounterpartyCategory?: string
  postcodeEstimated?: boolean
  postcodeErrorKm?: number
}
