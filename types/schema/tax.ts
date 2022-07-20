import type {SearchParams} from "src/request"
import type {Amount} from "./balance"

export interface TaxSearchParams extends SearchParams {
  startDate: string
  endDate: string
}

interface Details {
  category: string
  amount: {
    value: number
    currency: string
  }
}

interface TaxReturn {
  sa105: {
    income: {
      total: Amount
      details: Details[]
    }
    expenditure: {
      total: Amount
      details: Details[]
    }
    taxableIncome: {
      total: Amount
    }
  }
}

export interface Tax {
  startDate: string
  endDate: string
  taxReturn: TaxReturn
}
