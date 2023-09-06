import {RequestsParams} from "../request"
import {NotificationThresholdRequests} from "./types/notification-thresholds"

export default ({config, request}: RequestsParams): NotificationThresholdRequests => {
  const {resourceServerUrl} = config

  return {
    getNotificationThresholds: async ({userId, accountId}, options) =>
      request(`${resourceServerUrl}/accounts/${accountId}/notification-thresholds`, {
        cc: {
          scope: "accounts:read",
          sub: userId,
        },
        options,
      }),

    addNotificationThreshold: async ({userId, accountId, threshold}, options) =>
      request(`${resourceServerUrl}/accounts/${accountId}/notification-thresholds`, {
        method: "POST",
        cc: {
          scope: "accounts:read accounts:write",
          sub: userId,
        },
        options,
        body: threshold,
      }),

    updateNotificationThreshold: async ({userId, accountId, thresholdId, threshold}, options) =>
      request(`${resourceServerUrl}/accounts/${accountId}/notification-thresholds/${thresholdId}`, {
        method: "PATCH",
        cc: {
          scope: "accounts:read accounts:write",
          sub: userId,
        },
        options,
        body: threshold,
      }),

    deleteNotificationThreshold: async ({userId, accountId, thresholdId}, options) =>
      request(`${resourceServerUrl}/accounts/${accountId}/notification-thresholds/${thresholdId}`, {
        method: "DELETE",
        cc: {
          scope: "accounts:read accounts:write",
          sub: userId,
        },
        options,
        returnStatus: true,
      }),
  }
}
