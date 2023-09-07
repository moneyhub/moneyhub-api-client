import {ApiResponse, ExtraOptions} from "../../request"
import {NotificationThreshold, NotificationThresholdBody} from "../../schema/notification-threshold"

export type NotificationThresholdRequests = {
  getNotificationThresholds: ({}: {
    userId?: string
    accountId: string
  }, options?: ExtraOptions) => Promise<ApiResponse<NotificationThreshold[]>>

  addNotificationThreshold: ({}: {userId?: string, accountId: string, threshold: NotificationThresholdBody}, options?: ExtraOptions) => Promise<ApiResponse<NotificationThreshold>>

  updateNotificationThreshold: ({}: {userId?: string, accountId: string, thresholdId: string, threshold: NotificationThresholdBody}, options?: ExtraOptions) => Promise<ApiResponse<NotificationThreshold>>

  deleteNotificationThreshold: ({}: {
    userId?: string
    accountId: string
    thresholdId: string
  }, options?: ExtraOptions) => Promise<void>
}
