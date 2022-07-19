import {ApiResponse, SearchParams} from "src/request"
import {SavingsGoal} from "src/schema/savings-goal"

export interface SavingsGoalsRequests {
  getSavingsGoals: (
    params: SearchParams,
    userId: string
  ) => Promise<ApiResponse<SavingsGoal[]>>

  getSavingsGoal: ({
    goalId,
    userId,
  }: {
    goalId: string
    userId: string
  }) => Promise<ApiResponse<SavingsGoal>>

  createSavingsGoal: ({
    name,
    imageUrl,
    notes,
    accounts,
    amount,
    userId,
  }: {
    name: string
    imageUrl?: string
    notes?: string
    accounts: {id: string}[]
    amount: {
      value: number
      currency?: string
    }
    userId: string
  }) => Promise<ApiResponse<SavingsGoal>>

  updateSavingsGoal: ({
    goalId,
    name,
    amount,
    imageUrl,
    notes,
    accounts,
    userId,
  }: {
    goalId: string
    name?: string
    imageUrl?: string
    notes?: string
    accounts: {id: string}[]
    amount?: {
      value: number
    }
    userId: string
  }) => Promise<ApiResponse<SavingsGoal>>

  deleteSavingsGoal: ({
    goalId,
    userId,
  }: {
    goalId: string
    userId: string
  }) => Promise<number>
}
