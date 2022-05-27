export interface Amount {
  value: number
  majorUnits: number
  minorUnits: number
  currency: string
}

export interface Balance {
  amount: Amount
  date: string
}
