import type {Amount} from "./amount"

export interface AffordabilityMetadata {
  createdAt: string
  id: string
}

export interface Affordability extends AffordabilityMetadata {
  income: {
    amountConsistency: number
    longevity: {
      consecutiveIncomeMonths: number
      incomePeriodLengthMonths: number
    }
    predicted: Amount
    regularIncomeDetected: boolean
  }
  overdraftUseByAccount: {
    id: string
    daysInOverdraft: number
    earliestBalanceDate: string
  }[]
  overview: {
    discretionaryExpenses: Amount
    fixedExpenses: Amount
    flexibleExpenses: Amount
    income: Amount
    incomeIncludingTransfers: Amount
    nonDiscretionaryExpenses: Amount
  }
  primaryIncomeAccountId: string
  riskIndicators: {
    cashWithdrawals: Amount
    gambling: Amount
    loanRepayments: Amount
    outgoingTransfers: Amount
    returnedDirectDebits: {
      count: number
      periodMonths: number
    }
  }
}
