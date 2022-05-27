import {Amount} from "./balance"

enum Type {
  PAYMENT = "payment",
  INCOME = "income"
}

enum Frequency {
  WEEKLY = "weekly",
  FORTNIGHTLY = "fortnightly",
  MONTHLY = "monthly",
  QUARTERLY = "quarterly",
  YEARLY = "yearly"
}

export interface RegularTransaction {
  seriesId: string
  accountId: string
  type: Type
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
