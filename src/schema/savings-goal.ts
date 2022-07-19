import type {Amount} from "./balance"
export interface SavingsGoal {
  id: string
  name: string
  amount: Amount
  dateCreated: string
  imageUrl?: string
  notes?: string
  progressPercentage?: number
  progressAmount?: Amount
  accounts: {
    id: string
  }[]
}
