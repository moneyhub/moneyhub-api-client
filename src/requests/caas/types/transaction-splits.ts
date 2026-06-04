import {ApiResponse, ExtraOptions} from "../../../request"

export interface CaasTransactionSplitBody {
  amount: number
  userCategoryId: string
  description: string
}

export interface CaasTransactionSplit {
  amount: number
  userCategoryId: string
  description: string
}

export interface CaasTransactionSplitsRequests {
  caasPutTransactionSplits: (
    {
      accountId,
      transactionId,
      splits,
    }: {
      accountId: string
      transactionId: string
      splits: CaasTransactionSplitBody[]
    },
    options?: ExtraOptions,
  ) => Promise<ApiResponse<CaasTransactionSplit[]>>
  caasDeleteTransactionSplits: (
    {
      accountId,
      transactionId,
    }: {
      accountId: string
      transactionId: string
    },
    options?: ExtraOptions,
  ) => Promise<number>
}
