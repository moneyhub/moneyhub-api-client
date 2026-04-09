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
  matchMethod: string
  stitched: boolean
  numTxMatchedInSeries: number
  gapLengthInFreqUnits: number
  dateAnomaliesCount: number
  numReturnedTxs: number
  lastDate: string
  predictedDate: string
  predictedDateEarliest?: string | null
  predictedDateLatest?: string | null
  predictedDateMethod: string
  predictedTxLateOrNotDetected?: boolean | null
  predictedAmount: number | null
  predictedAmountLower?: number | null
  predictedAmountUpper?: number | null
  predictedAmountMethod: string
  currency?: string | null
  counterpartyId?: string | null
  predictedCategoryId: string
  analysisCategory?: string | null
  transactions: CaasRegularTransactionLine[]
}

export interface CaasRegularTransactionsRequests {
  caasGetRegularTransactions: (
    {accountId}: {accountId: string},
    options?: ExtraOptions,
  ) => Promise<ApiResponse<CaasRegularTransaction[]>>
}
