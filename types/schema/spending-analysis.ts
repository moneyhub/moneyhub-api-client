interface Amount {
  currentMonth: number
  previousMonth: number
}

interface Category extends Amount {
  categoryId?: string
  categoryGroup?: string
}

export interface SpendingAnalysis {
  categories: Category[]
  total: Amount
}
