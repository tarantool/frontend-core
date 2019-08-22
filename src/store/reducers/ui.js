// @flow

import { HIDE_NOTIFICATION_LIST, SHOW_NOTIFICATION_LIST } from '../constants'
import type { FSA } from '../../core'

export type UiState = {
  showNotificationList: boolean
}

const initialState = {
  showNotificationList: false
}

export default (state: UiState = initialState, { type } : FSA): UiState => {
  switch (type) {
    case SHOW_NOTIFICATION_LIST: {
      return {
        ...state,
        showNotificationList: true,
      }
    }
    case HIDE_NOTIFICATION_LIST: {
      return {
        ...state,
        showNotificationList: false,
      }
    }
  }
  return state
}
