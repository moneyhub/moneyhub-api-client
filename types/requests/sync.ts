import {ApiResponse} from "../request"

export enum SyncStatus {
  OK = "ok",
  ERROR = "error"
}

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
