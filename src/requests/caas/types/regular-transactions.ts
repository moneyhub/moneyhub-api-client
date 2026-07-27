import {ApiResponse, ExtraOptions} from "../../../request"

export type CaasRegularTransactionSeriesType = "payment" | "income"

export type CaasRegularTransactionFrequency =
  | "weekly"
  | "fortnightly"
  | "monthly"
  | "quarterly"
  | "yearly"

export type CaasRegularTransactionSubtype =
  | "directDebit"
  | "standingOrder"
  | "frequentVisit"
  | "committedCardPayment"
  | "other"

export interface CaasRegularTransactionLine {
  uid: string
  date: string
  amount: number
  categoryId: string
  description: string
  cleanedDescription: string
  txCode?: string | null
  cardPresent?: boolean | null
  l3CounterpartyCategory?: string | null
}

export interface CaasRegularTransaction {
  seriesId: string
  accountId: string
  userId?: string | null
  type: CaasRegularTransactionSeriesType
  subtype?: CaasRegularTransactionSubtype | null
  frequency: CaasRegularTransactionFrequency
  description: string
  cleanedDescription: string
  numTxMatchedInSeries: number
  gapLengthInFreqUnits: number
  dateAnomaliesCount: number
  numReturnedTxs: number
  lastDate: string
  predictedDate: string
  predictedDateEarliest?: string | null
  predictedDateLatest?: string | null
  predictedTxLateOrNotDetected?: boolean | null
  predictedAmount: number | null
  predictedAmountLower?: number | null
  predictedAmountUpper?: number | null
  currency?: string | null
  counterpartyId?: string | null
  l3CounterpartyCategory?: string | null
  predictedCategoryId: string | null
  transactions: CaasRegularTransactionLine[]
}

export interface CaasRegularTransactionsRequests {
  caasGetRegularTransactions: (
    {accountId}: {accountId: string},
    options?: ExtraOptions,
  ) => Promise<ApiResponse<CaasRegularTransaction[]>>
}
