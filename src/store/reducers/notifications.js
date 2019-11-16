// @flow
import * as R from 'ramda'

import {
  CHECK_NOTIFICATIONS,
  HIDE_NOTIFICATION,
  PAUSE_NOTIFICATION_TIMER,
  UNPAUSE_NOTIFICATION_TIMER,
  SEND_NOTIFICATION,
  SHOW_NOTIFICATION_LIST,
  CLEAR_NOTIFICATIONS,
  GARBAGE_NOTIFICATIONS
} from '../constants'

import type {
  CheckNotificationsAction,
  ClearNotificationsAction,
  GarbageNotificationsAction,
  HideNotificationAction,
  HideNotificationListAction,
  PauseNotificationTimerAction,
  SendNotificationAction,
  ShowNotificationListAction,
  UnpauseNotificationTimerAction
} from '../actions/notifications'

export type NotificationItem = {
  uuid: string,
  type: 'default' | 'warning' | 'error' | 'success',
  title: ?string,
  message: ?string,
  timeout: number,
  pausedAt: ?number,
  createdAt: number,
  initedAt: number,
  read: boolean
}

export const notificationFields = [
  'uuid',
  'type',
  'title',
  'message',
  'timeout',
  'pausedAt',
  'createdAt',
  'initedAt',
  'read'
]

export type NotificationState = {
  active: Array<NotificationItem>,
  archive: Array<NotificationItem>
}

type NotificationActions =
  | SendNotificationAction
  | HideNotificationAction
  | ShowNotificationListAction
  | HideNotificationListAction
  | CheckNotificationsAction
  | PauseNotificationTimerAction
  | UnpauseNotificationTimerAction
  | ClearNotificationsAction
  | GarbageNotificationsAction

const isTimeouted = ts => ({ createdAt, timeout, pausedAt }) => {
  if (pausedAt || timeout === 0) return false
  return ts - createdAt > timeout
}

const updateOps = (uuid, ops) => item => {
  if (item.uuid === uuid) {
    return ops(item)
  }
  return item
}

export const garbageTimeout = 1000 * 60 * 60 * 24 * 3

const garbageFilter = (ts: number) => (item: NotificationItem) => ts - item.createdAt < garbageTimeout

export const initialState = {
  active: [],
  archive: []
}

export default (state: NotificationState = initialState, action: NotificationActions): NotificationState => {
  switch (action.type) {
    case SEND_NOTIFICATION: {
      const isExistsWithSameTextAndTitle = state.active.some(
        R.compose(
          R.equals([action.payload.title, action.payload.message]),
          R.props(['title', 'message'])
        )
      )

      if (isExistsWithSameTextAndTitle) {
        return state;
      }
      return {
        ...state,
        active: state.active.concat([
          {
            read: false,
            pausedAt: null,
            createdAt: action.payload.createdAt,
            initedAt: action.payload.createdAt,
            ...action.payload
          }
        ])
      }
    }
    case CHECK_NOTIFICATIONS: {
      const checkTimeout = isTimeouted(action.payload.ts)
      const needModify = state.active.filter(x => checkTimeout(x))
      if (needModify.length > 0) {
        return {
          active: state.active.filter(x => !checkTimeout(x)),
          archive: state.archive.concat(needModify)
        }
      }
      return state
    }
    case PAUSE_NOTIFICATION_TIMER: {
      return {
        ...state,
        active: state.active.map(
          updateOps(action.payload.uuid, R.mergeDeepLeft({ pausedAt: action.payload.ts, read: true }))
        )
      }
    }
    case UNPAUSE_NOTIFICATION_TIMER: {
      return {
        ...state,
        active: state.active.map(
          updateOps(action.payload.uuid, item => {
            return {
              ...item,
              createdAt: item.createdAt + (action.payload.ts - (item.pausedAt || action.payload.ts)),
              pausedAt: null
            }
          })
        )
      }
    }
    case SHOW_NOTIFICATION_LIST: {
      return {
        ...state,
        archive: state.archive.map(x => ({ ...x, read: true })),
        active: state.active.map(x => ({ ...x, read: true }))
      }
    }
    case HIDE_NOTIFICATION: {
      const archived = state.active.find(x => x.uuid === action.payload.uuid)
      return {
        archive: state.archive.concat([{ ...archived, read: true }]),
        active: state.active.filter(x => x.uuid !== action.payload.uuid)
      }
    }
    case CLEAR_NOTIFICATIONS: {
      return {
        ...state,
        archive: []
      }
    }
    case GARBAGE_NOTIFICATIONS: {
      const filter = garbageFilter(action.payload.ts)
      return {
        active: state.active.filter(filter),
        archive: state.archive.filter(filter)
      }
    }
  }
  return state
}
