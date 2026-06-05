import {ApiResponse, ExtraOptions} from "../../../request"
import type {
  CaasL1CategoryGroupId,
  CaasL1CategoryGroupName,
  CaasL1CategoryType,
  CaasL2CategoryId,
  CaasL2CategoryName,
} from "./categories"
import type {CaasTransactionSplit} from "./transaction-splits"

export interface CaasEnrichTransactionsResponse {
  data: CaasTransaction[]
  meta: {
    errorTransactionIds: string[]
    correlationId: string
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

export type CaasL4LoanType =
  | "Unsecured"
  | "Secured"
  | "Secured Vehicle"
  | "Buy Now Pay Later"
  | "High Cost Short Term Credit"
  | "Debt Collection Agency/Debt Management Plan"

export interface CaasTransactionInput {
  userId?: string | null
  accountId: string
  transactionId: string
  accountType: CaasAccountType
  date: string
  status: CaasTransactionStatus
  description: string
  amount: number
  currency?: string
  txCode?: string | null
  merchantCategoryCode?: string | null
  cardPresent?: boolean | null
  meta?: Record<string, any> | null
  splits?: CaasTransactionSplit[]
}

export type CaasRecategorisationType = "single" | "future"

export interface CaasTransactionsRequests {
  caasPatchTransaction: (
    {
      accountId,
      transactionId,
      userCategoryId,
      recategorisationType,
    }: {
      accountId: string
      transactionId: string
      userCategoryId: string
      recategorisationType?: CaasRecategorisationType
    },
    options?: ExtraOptions,
  ) => Promise<ApiResponse<CaasTransaction>>
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
  ) => Promise<number>
}

export interface CaasTransaction {
  userId: string | null
  accountId: string
  transactionId: string
  accountType: CaasAccountType
  txCode: string | null
  date: string
  status: CaasTransactionStatus
  description: string
  amount: number
  currency: string
  merchantCategoryCode: string | null
  cardPresent: boolean | null
  meta: Record<string, any> | null
  splits?: CaasTransactionSplit[]
  mhInsights: CaasTransactionInsights
}

export interface CaasTransactionInsights {
  l1CategoryGroupId?: CaasL1CategoryGroupId
  l1CategoryGroupName?: CaasL1CategoryGroupName
  l1CategoryType?: CaasL1CategoryType
  l2CategoryId: CaasL2CategoryId
  l2CategoryName?: CaasL2CategoryName
  l3Counterparty?: CaasCounterparty | null
  geotags?: CaasGeotag[]
  userCategoryId?: string | null
  cardPresent: boolean | null
  timestampCreated: string
  timestampIngress: string
  timestampEgress: string
}

export interface CaasCounterparty {
  l3CounterpartyId: string
  l3CounterpartyName?: string
  parentId?: string | null
  parentName?: string | null
  fullCompanyName?: string | null
  logoUrl?: string | null
  website?: string | null
  registeredLocation?: string | null
  l3CounterpartyCategory?: string
  l2CategoryName?: string
  l4LoanType?: CaasL4LoanType | null
}

export interface CaasGeotag {
  geotagId: string
  counterpartyName: string | null
  counterpartyLabel: string | null
  houseNumber?: string | null
  street?: string | null
  neighbourhood?: string | null
  locality?: string | null
  city?: string | null
  county?: string | null
  region?: string | null
  postcode?: string | null
  latitude: number | null
  longitude: number | null
  l3CounterpartyCategory?: string | null
  postcodeEstimated: boolean
  postcodeErrorKm?: number | null
}
