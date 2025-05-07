export type CategorisedTransaction = {
  id: string
  description: string
  date: string
  amount: {
    value: number
  }
  categoryId?: string
  counterpartyId?: string
  proprietaryTransactionCode?: string
  merchantCategoryCode?: string
}

export type TransactionToBeCategorised = {
  id?: string
  description: string
  date: string
  amount: {
    value: number
  }
  proprietaryTransactionCode?: string
  merchantCategoryCode?: string
}
