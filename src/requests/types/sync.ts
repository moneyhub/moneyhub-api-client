import type {ApiResponse, ExtraOptions} from "../../request"
import type {SyncResponse} from "../../schema/sync"

export interface SyncRequests {
  syncUserConnection: ({
    userId,
    connectionId,
    customerIpAddress,
    customerLastLoggedTime,
    enableAsync,
  }: {
    userId?: string
    connectionId: string
    customerIpAddress?: string
    customerLastLoggedTime?: string
    enableAsync?: boolean
  }, options?: ExtraOptions) => Promise<ApiResponse<SyncResponse>>
}
