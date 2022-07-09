import {ApiResponse} from "src/request"

type SyncStatus =
  | "ok"
  | "error"

type SyncResponse = {
  status: SyncStatus
}

export interface SyncRequests {
  syncUserConnection: ({
    userId,
    connectionId,
    customerIpAddress,
    customerLastLoggedTime,
  }: {
    userId: string
    connectionId: string
    customerIpAddress?: string
    customerLastLoggedTime?: string
  }) => Promise<ApiResponse<SyncResponse>>
}
