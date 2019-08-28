// @flow
import * as R from 'ramda';

import {
  CHECK_NOTIFICATIONS,
  HIDE_NOTIFICATION,
  PAUSE_NOTIFICATION_TIMER,
  UNPAUSE_NOTIFICATION_TIMER,
  SEND_NOTIFICATION,
  SHOW_NOTIFICATION_LIST, CLEAR_NOTIFICATIONS
} from '../constants'
import type { FSA } from '../../core'
import type {
  CheckNotificationsAction, ClearNotificationsAction,
  HideNotificationAction,
  HideNotificationListAction, PauseNotificationTimerAction,
  SendNotificationAction,
  ShowNotificationListAction, UnpauseNotificationTimerAction
} from '../actions/notifications'

export type NotificationItem = {
  uuid: string,
  type: 'default' | 'warning' | 'error' | 'success',
  title?: string,
  message?: string,
  timeout: number,
  pausedAt: ?number,
  createdAt: number,
  initedAt: number,
  hidden: boolean,
  read: boolean,
}

export type NotificationState = Array<NotificationItem>

type NotificationActions = SendNotificationAction | HideNotificationAction |
  ShowNotificationListAction | HideNotificationListAction | CheckNotificationsAction |
  PauseNotificationTimerAction | UnpauseNotificationTimerAction | ClearNotificationsAction

const isTimeouted = (ts) => ({createdAt, timeout, pausedAt, hidden}) => {
  if (pausedAt || hidden || timeout === 0)
    return false
  return (ts - createdAt) > timeout
}

const updateOps = (uuid, ops) => (item) => {
  if (item.uuid === uuid) {
    return ops(item)
  }
  return item
}

const initialState = []

export default (state: NotificationState = initialState, action: NotificationActions): NotificationState => {
  switch (action.type) {
    case SEND_NOTIFICATION: {
      return state.concat([{
        hidden: false,
        read: false,
        pausedAt: null,
        createdAt: action.payload.createdAt,
        initedAt: action.payload.createdAt,
        ...action.payload
      }])
    }
    case CHECK_NOTIFICATIONS: {
      const checkTimeout = isTimeouted(action.payload.ts)
      const needModify = state.find(checkTimeout)
      if (needModify) {
        return state.map(notification => {
          if (checkTimeout(notification))
            return {
              ...notification,
              hidden: true,
            }
          else
            return notification
        })
      }
      return state
    }
    case PAUSE_NOTIFICATION_TIMER: {
      return state.map(updateOps(action.payload.uuid, R.mergeDeepLeft({ pausedAt: action.payload.ts, read: true })))
    }
    case UNPAUSE_NOTIFICATION_TIMER: {
      return state.map(updateOps(action.payload.uuid, (item) => {
        return {
          ...item,
          createdAt: item.createdAt + (action.payload.ts - (item.pausedAt || action.payload.ts) ),
          pausedAt: null
        }
      }))
    }
    case SHOW_NOTIFICATION_LIST: {
      return state.map(x => ({...x, read: true}))
    }
    case HIDE_NOTIFICATION: {
      return state.map(updateOps(action.payload.uuid, R.mergeDeepLeft({ hidden: true, read: true })))
    }
    case CLEAR_NOTIFICATIONS: {
      return state.filter(x => !x.hidden)
    }
  }
  return state
}
