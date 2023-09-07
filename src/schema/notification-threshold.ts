export type NotificationThresholdType =
 | "lt"
 | "gt"

export type NotificationThresholdBody = {
  value: number
  type: NotificationThresholdType
}

export type NotificationThreshold = NotificationThresholdBody & {
  id: string
}
