import type {ApiResponse, ExtraOptions} from "../../request"
import type {SyncResponse} from "../../schema/sync"

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
  }, options?: ExtraOptions) => Promise<ApiResponse<SyncResponse>>
}
