interface SyncAccount {
  providerId: string
  accountId: string
}

type SyncStatus =
  | "ok"
  | "error"

export interface ConnectionSync {
  id: string
  connectionId: string
  action: "auto-update" | "client-update"
  method: "ADD" | "UPDATE"
  fetchStatus: "success" | "error" | "partial" | "mfa-required" | "credentials-error"
  createdAt: string
  fetchedAt: string
  accounts: SyncAccount[]
}

export interface SyncResponse {
  status: SyncStatus
}
