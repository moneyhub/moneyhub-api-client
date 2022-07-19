import type {Amount} from "./balance"

type RegularTransactionType = "payment" | "income"

type Frequency =
  | "weekly"
  | "fortnightly"
  | "monthly"
  | "quarterly"
  | "yearly"

export interface RegularTransaction {
  seriesId: string
  accountId: string
  type: RegularTransactionType
  description?: string
  cleanedDescription: string
  counterpartyId?: string
  frequency: Frequency
  numTxMatchedInSeries: number
  gapLengthInFreqUnits?: number
  dateAnomaliesCount?: number
  numReturnedTxs?: number
  lastDate: string
  predictedDate: string
  predictedDateEarliest?: string
  predictedDateLatest?: string
  predictedTxLateOrNotDetected?: boolean
  predictedAmount: Amount
  predictedAmountLower?: Amount
  predictedAmountUpper?: Amount
  predictedCategoryId?: string
  transactions: string[]
}

export interface RegularTransactionSearchParams {
  accountId?: string
}
