import type {SearchParams} from "../request"

export interface ConsentHistorySearchParams extends SearchParams {
  userId?: string
}

interface AccountDetails {
  schemeName: "UK.OBIE.SortCodeAccountNumber" | "UK.OBIE.IBAN" | "UK.OBIE.PAN"
  identification: string
}

interface VRPDetails {
  accountTo: string
  accountFrom: string
}

export interface ConsentHistory {
  authorizationRequestId: string
  consentId: string
  consentType: string
  consentStatus: string
  consentTo: string
  consentFrom: string
  permissions?: string[] | readonly string[]
  cancelledAt: string | null
  erroredAt: string | null
  createdAt: string
  expiresAt: string
  accountDetails?: AccountDetails[]
  vrpDetails?: VRPDetails
  userId: string
  provider: string
}
