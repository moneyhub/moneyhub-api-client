import {ApiResponse} from "../request"

enum Status {
  OK = "ok",
  ERROR = "error"
}

interface SyncResponse {
  status: Status
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
