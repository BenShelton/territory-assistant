type NotificationType = 'success' | 'info' | 'warning' | 'error'

export interface INotificationOptions {
  type: NotificationType
  text: string
  timeout?: number
}

export interface INotification {
  id: number
  type: NotificationType
  text: string
}
