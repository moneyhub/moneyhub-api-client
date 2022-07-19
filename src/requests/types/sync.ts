import type {ApiResponse} from "src/request"
import type {SyncResponse} from "src/schema/sync"

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
