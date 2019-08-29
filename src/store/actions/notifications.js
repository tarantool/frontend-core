// @flow
import nanoid from 'nanoid'
import {
  CHECK_NOTIFICATIONS,
  CLEAR_NOTIFICATIONS,
  HIDE_NOTIFICATION,
  HIDE_NOTIFICATION_LIST,
  PAUSE_NOTIFICATION_TIMER,
  SEND_NOTIFICATION,
  SHOW_NOTIFICATION_LIST,
  UNPAUSE_NOTIFICATION_TIMER
} from '../constants'

type SendNotification = {
  type: 'default' | 'warning' | 'error' | 'success',
  title: string,
  message?: string,
  timeout?: number
}

export type SendNotificationAction = {
  type: typeof SEND_NOTIFICATION,
  payload: {
    type: 'default' | 'warning' | 'error' | 'success',
    title: string,
    message?: string,
    timeout: number,
    uuid: string,
    createdAt: number
  }
}

export type CheckNotificationsAction = {
  type: typeof CHECK_NOTIFICATIONS,
  payload: {
    ts: number
  }
}

export type HideNotificationAction = {
  type: typeof HIDE_NOTIFICATION,
  payload: {
    uuid: string,
    ts: number
  }
}

export type ShowNotificationListAction = {
  type: typeof SHOW_NOTIFICATION_LIST,
  payload: {}
}

export type HideNotificationListAction = {
  type: typeof HIDE_NOTIFICATION_LIST,
  payload: {}
}

export type PauseNotificationTimerAction = {
  type: typeof PAUSE_NOTIFICATION_TIMER,
  payload: {
    uuid: string,
    ts: number
  }
}

export type UnpauseNotificationTimerAction = {
  type: typeof UNPAUSE_NOTIFICATION_TIMER,
  payload: {
    uuid: string,
    ts: number
  }
}

export type ClearNotificationsAction = {
  type: typeof CLEAR_NOTIFICATIONS,
  payload: {}
}

export const sendNotification = ({
  type = 'default',
  title,
  message,
  timeout = 30000
}: SendNotification): SendNotificationAction => {
  const uuid = nanoid()

  const now = Date.now()

  const payload = {
    type,
    title,
    message,
    timeout,
    uuid,
    createdAt: now
  }

  return {
    type: SEND_NOTIFICATION,
    payload
  }
}

export const checkNotifications = (): CheckNotificationsAction => ({
  type: CHECK_NOTIFICATIONS,
  payload: { ts: Date.now() }
})

export const hideNotification = (uuid: string): HideNotificationAction => ({
  type: HIDE_NOTIFICATION,
  payload: {
    uuid,
    ts: Date.now()
  }
})

export const pauseNotificationTimer = (uuid: string) => ({
  type: PAUSE_NOTIFICATION_TIMER,
  payload: {
    uuid,
    ts: Date.now()
  }
})
export const unpauseNotificationTimer = (uuid: string) => ({
  type: UNPAUSE_NOTIFICATION_TIMER,
  payload: {
    uuid,
    ts: Date.now()
  }
})

export const showNotificationList = (): ShowNotificationListAction => ({
  type: SHOW_NOTIFICATION_LIST,
  payload: {}
})

export const hideNotificationList = (): HideNotificationListAction => ({
  type: HIDE_NOTIFICATION_LIST,
  payload: {}
})

export const clearNotifications = (): ClearNotificationsAction => ({
  type: CLEAR_NOTIFICATIONS,
  payload: {}
})
