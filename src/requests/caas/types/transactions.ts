import {ApiResponse, ExtraOptions} from "../../../request"

export interface CaasTransactionInput {
  userId: string
  accountId: string
  providerId: string
  transactionId: string
  accountType: string
  txCode: string
  date: string
  status: string
  description: string
  amount: number
  currency: string
  merchantCategoryCode: string
  cardPresent: boolean
}

export interface CaasTransactionsRequests {
  caasPatchTransaction: ({
    accountId,
    transactionId,
    l2CategoryId,
  }: {
    accountId: string
    transactionId: string
    l2CategoryId: string
  }, options?: ExtraOptions) => Promise<ApiResponse<CaasTransaction[]>>
  caasEnrichTransactions: ({
    transactions,
  }: {
    transactions: CaasTransactionInput[]
  }, options?: ExtraOptions) => Promise<ApiResponse<CaasTransaction[]>>
  caasGetTransactions: ({
    userId,
    accountId,
    limit,
  }: {
    userId?: string
    accountId: string
    limit?: number
  }, options?: ExtraOptions) => Promise<ApiResponse<CaasTransaction[]>>
  caasDeleteTransaction: ({
    accountId,
    transactionId,
  }: {
    accountId: string
    transactionId: string
  }, options?: ExtraOptions) => Promise<void>
}

export interface CaasTransaction {
  userId: string
  accountId: string
  transactionId: string
  accountType: string
  txCode: string
  date: string
  status: string
  description: string
  amount: number
  currency: string
  merchantCategoryCode: string
  cardPresent: boolean
  meta: {
    additionalProp1: Record<string, unknown>
  }
  mhInsights: CaasTransactionInsights
}

export interface CaasTransactionInsights {
  l1CategoryGroupId: string
  l1CategoryGroupName: string
  l1CategoryType: string
  l2CategoryId: string
  l2CategoryName: string
  l3Counterparty: CaasCounterparty
  geotags: CaasGeotag[]
  cardPresent: boolean
  timestampCreated: string
  timestampIngress: string
  timestampEgress: string
}

export interface CaasCounterparty {
  l3CounterpartyId: string
  l3CounterpartyName: string
  parentId: string | null
  parentName: string | null
  fullCompanyName: string
  logoUrl: string
  website: string
  registeredLocation: string
  l3CounterpartyCategory: string
  l2CategoryName: string
}

export interface CaasGeotag {
  geotagId: string
  counterpartyName: string
  counterpartyLabel: string
  houseNumber: string
  street: string
  neighbourhood: string
  locality: string
  city: string
  county: string
  region: string
  postcode: string
  latitude: number
  longitude: number
  l3CounterpartyCategory: string
  postcodeEstimated: boolean
  postcodeErrorKm: number
}
