import type {SearchParams} from "../request"

type CounterpartyType = "global" | "local"

export interface Counterparty {
  id: string
  label: string
  type: CounterpartyType
  companyName?: string
  logo?: string
  website?: string
  mcc?: {
    code?: string
    name?: string
  }
}

export interface GlobalCounterpartiesSearchParams extends SearchParams {
  counterpartiesVersion?: "v2" | "v3"
}

export interface GlobalCounterparty {
  id: string
  label: string
  companyName: string
  logo: string
  website: string
  mcc: {
    code?: string
    name?: string
  }
}
