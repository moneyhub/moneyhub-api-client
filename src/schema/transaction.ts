import type {Amount, Balance} from "./balance"

export interface RecurringTransactionEstimate {
  counterpartyId?: string
  amount?: Balance
  amountRange?: Balance
  monthlyAmount?: Balance
  predictionSource?: "moneyhub"
  monthlyAverageOnly?: boolean
  dates?: string[]
}

export interface TransactionFile {
  id: string
  fileType: string
  fileName: string
  url: string
}

export interface TransactionSplitPost {
  amount: number
  categoryId: string
  description: string
  projectId?: string
}

export interface TransactionSplit {
  amount: Amount
  categoryId: string
  description: string
  id: string
  projectId?: string
}

export interface TransactionSplitPatch {
  categoryId?: string
  description?: string
  projectId?: string
}

export interface TransactionSearchParams {
  limit?: number
  offset?: number
  ids?: string[]
  startDate?: string
  endDate?: string
  startDateModified?: string
  endDateModified?: string
  text?: string
  categoryId?: string
  accountId?: string
  accountIds?: string[]
  projectId?: string
  projectIds?: string
  creditDebitIndicator?: string
  hasProject?: boolean
  contains?: string
  hasEnhancedCategory?: string
  counterpartyIdsV2?: string[]
  counterpartiesVersion?: "v2" | "v3"
  enhancedCategories?: string
  onlyCount?: boolean
}
export type TransactionUnenrichedSearchParams = Pick<
  TransactionSearchParams,
  | "limit"
  | "offset"
  | "startDate"
  | "endDate"
  | "startDateModified"
  | "endDateModified"
  | "text"
  | "accountId"
  | "accountIds"
  | "creditDebitIndicator"
  | "onlyCount"
  | "contains"
>

interface CardInstrument {
  name?: string
  pan?: string
  cardSchemeName?: string
  authorisationType?: string
}

interface CreditorDebtorAccount {
  name?: string
  sortCode?: string
  accountNumber?: string
  iban?: string
  pan?: string
}

interface CreditorDebtorAgent {
  name?: string
  postalAddress?: object
}

type Status = "posted" | "pending"

export interface Transaction {
  accountId?: string
  amount: Amount
  categoryId: string
  categoryIdConfirmed: boolean
  date: string
  dateModified: string
  dateCreated?: string
  valueDate?: string
  id: string
  longDescription: string
  providerId?: string
  notes: string
  shortDescription: string
  counterpartyId?: string
  status: Status
  projectId?: string
  enhancedCategories?: object
  splits?: TransactionSplit[]
  transactionCode?: {
    code: string
    subCode: string
  }
  proprietaryTransactionCode: {
    code: string
    issuer?: string
  }
  balance?: Amount
  balanceType?: string
  statementReference?: string
  merchantCategoryCode?: string
  cardInstrument?: CardInstrument
  creditorAccount?: CreditorDebtorAccount
  debtorAccount?: CreditorDebtorAccount
  creditorAgent?: CreditorDebtorAgent
  debtorAgent?: CreditorDebtorAgent
  transactionReference?: string
  transactionInformation?: string
}

export type TransactionUnenriched = Pick<
  Transaction,
  | "accountId"
  | "amount"
  | "date"
  | "dateModified"
  | "dateCreated"
  | "valueDate"
  | "id"
  | "longDescription"
  | "providerId"
  | "status"
  | "transactionCode"
  | "proprietaryTransactionCode"
  | "balance"
  | "balanceType"
  | "statementReference"
  | "merchantCategoryCode"
  | "cardInstrument"
  | "creditorAccount"
  | "debtorAccount"
  | "creditorAgent"
  | "debtorAgent"
  | "transactionReference"
  | "transactionInformation"
>

export interface TransactionPost {
  accountId: string
  amount: {
    value: number
  }
  categoryId: string
  categoryIdConfirmed?: boolean
  date: string
  longDescription: string
  shortDescription?: string
  notes?: string
  status?: Status
  projectId?: string
  enhancedCategories?: object
}

export type TransactionPatch = Partial<TransactionPost>
