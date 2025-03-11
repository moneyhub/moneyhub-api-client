type ConnectionType = "api" | "legacy" | "test" | "zoopla" | "mouseprice" | "autotrader"

interface AccountType {
  beta: boolean
  name: "cash" | "card" | "savings" | "loan" | "mortgage" | "pension" | "investment" | "properties" | "crypto" | "asset"
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
  accountIds: string[]
  status: "ok" | "error" | "never"
  extendedStatus?: "expired" | "stoppedSyncing"
  lastUpdated?: string
  expiresAt?: string
  error?: "resync" | "sync_error" | "sync_partial" | "mfa_required" | "credentials_error"
  userConsentedAt?: string
  tppConsent?: boolean
  singleSyncOnly?: boolean
  useMfa?: boolean
}
