export interface Amount {
  value: number
  majorUnits: number
  minorUnits: number
  currency: string
}

export interface AmountPost {
  value: number
  currency?: string
}

export interface Balance {
  amount: Amount
  date: string
  type?: string
}

export interface BalancePost {
  amount: AmountPost
  date: string
}
