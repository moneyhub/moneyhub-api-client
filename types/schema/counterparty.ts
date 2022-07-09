import type {SearchParams} from "src/request"

enum Type {
  GLOBAL = "global",
  LOCAL = "local"
}

export interface Counterparty {
  id: string
  label: string
  type: Type
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
