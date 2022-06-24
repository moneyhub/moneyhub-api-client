import {ApiResponse, SearchParams} from "../request"
import {SpendingGoal} from "../schema/spending-goal"

export enum SpendingGoalsPeriodType {
  MONTHLY = "monthly",
  ANNUAL = "annual"
}

type Amount = {
  value: number
}

export interface SpendingGoalsRequests {
  getSpendingGoals: (
    params: SearchParams,
    userId: string
  ) => Promise<ApiResponse<SpendingGoal[]>>

  getSpendingGoal: ({
    goalId,
    userId,
  }: {
    goalId: string
    userId: string
  }) => Promise<ApiResponse<SpendingGoal>>

  createSpendingGoal: ({
    categoryId,
    periodType,
    periodStart,
    amount,
    userId,
  }: {
    categoryId: string
    periodType?: SpendingGoalsPeriodType
    periodStart?: string
    amount: Amount
    userId: string
  }) => Promise<ApiResponse<SpendingGoal>>

  updateSpendingGoal: ({
    goalId,
    categoryId,
    amount,
    userId,
  }: {
    goalId: string
    categoryId?: string
    amount?: Amount
    userId: string
  }) => Promise<ApiResponse<SpendingGoal>>

  deleteSpendingGoal: ({
    goalId,
    userId,
  }: {
    goalId: string
    userId: string
  }) => Promise<number>
}
