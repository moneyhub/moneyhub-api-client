type ConnectionType = "api" | "legacy" | "test" | "zoopla" | "mouseprice"

interface AccountType {
  beta: boolean
  name: "cash:current" | "savings" | "card" | "investment" | "loan" | "mortgage:repayment" | "mortgage:interestOnly" | "pension" | "pension:definedBenefit" | "pension:definedContribution" | "asset" | "properties:residential" | "properties:buyToLet" | "crypto"
}

type UserType = "personal" | "business"

type Payments = "domestic"

type Status = "AVAILABLE" | "PARTIALLY_AVAILABLE" | "TEMPORARILY_UNAVAILABLE" | "PERMANENTLY_UNAVAILABLE"

export interface WellKnownConnection {
  id: string
  name: string
  type: ConnectionType
  country: string
  parentRef: string
  bankRef: string
  isBeta: boolean
  accountTypes: AccountType[]
  iconUrl: string
  userTypes: UserType[]
  payments: Payments[]
  status: {
    sync: Status
    auth: Status
  }
}

export interface UserConnection {
  id: string
  name: string
  type: ConnectionType
  connectedOn: string
  lastUpdated: string
  expiresAt: string
  accountIds: string[]
  status: "ok" | "error"
  error?: "resync" | "sync_error" | "sync_partial" | "mfa_required" | "credentials_error"
  userConsentedAt?: string
  tppConsent?:boolean
}
