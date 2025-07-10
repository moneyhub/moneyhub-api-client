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

/** Global counterparty shape returned by the v2 API (id format: "global:...") */
export interface GlobalCounterpartyV2 {
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

export interface GlobalCounterpartyV3 {
  id: string
  name: string
  parentId?: string
  parentName?: string
  fullCompanyName?: string | null
  logoUrl?: string | null
  website?: string | null
  merchantCategoryCode?: string | null
  merchantCategoryDescription?: string | null
  registeredLocation?: string | null
  categoryId?: string
  analyticalCategory?: string
  transactionCategoryId?: string
  transactionCategory?: string
}

/** Global counterparty in either v2 or v3 API format. */
export type GlobalCounterparty = GlobalCounterpartyV2 | GlobalCounterpartyV3
