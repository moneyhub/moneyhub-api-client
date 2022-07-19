import type {Amount} from "./balance"

type PeriodType = "monthly" | "annual"

interface Spending {
  date: string
  spent: number
}

export interface SpendingGoal {
  categoryId: string
  dateCreated: string
  periodType: PeriodType
  periodStart: string
  id: string
  amount: Amount
  spending: Spending[]
}
