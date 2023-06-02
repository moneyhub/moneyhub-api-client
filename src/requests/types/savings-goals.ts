import {ApiResponse, ExtraOptions, SearchParams} from "../../request"
import {SavingsGoal} from "../../schema/savings-goal"

export interface SavingsGoalsRequests {
  getSavingsGoals: (
    params: SearchParams,
    userId: string, options?: ExtraOptions
  ) => Promise<ApiResponse<SavingsGoal[]>>

  getSavingsGoal: ({
    goalId,
    userId,
  }: {
    goalId: string
    userId: string
  }, options?: ExtraOptions) => Promise<ApiResponse<SavingsGoal>>

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
  }, options?: ExtraOptions) => Promise<ApiResponse<SavingsGoal>>

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
  }, options?: ExtraOptions) => Promise<ApiResponse<SavingsGoal>>

  deleteSavingsGoal: ({
    goalId,
    userId,
  }: {
    goalId: string
    userId: string
  }, options?: ExtraOptions) => Promise<number>
}
