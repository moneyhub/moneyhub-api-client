enum CodeType {
  ISIN,
  SEDOL,
  MEX
}

interface Price {
  value: number
  currency: string
}

interface Matched {
  isin?: string
  name?: string
  score?: number
  priceGBP?: number
  price?: Price
  date?: string
}

interface Code {
  code?: string
  type?: CodeType
}

interface HoldingsValuationItem {
  codes: Code[]
  description: string
  quantity: number
  total: Price
  unitPrice: Price
  currency: string
}

export interface HoldingsValuation {
  date: string
  items: HoldingsValuationItem[]
}

export interface HoldingWithMatches {
  date?: string
  id: string
  matched: Matched[]
  codes: Code[]
  name: string
  quantity: number
  total: Price
  unitPrice: Price
  currency: string
}

interface HoldingHistory {
  total: Price
  unitPrice: Price
  quantity: number
  date: string
}

export interface HoldingWithMatchesAndHistory extends HoldingWithMatches {
  history: HoldingHistory[]
}
