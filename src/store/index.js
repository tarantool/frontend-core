// @flow
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import menuReducer, { type MenuState } from './reducers/menu'
import notificationsReducer, { type NotificationState } from './reducers/notifications'
import uiReducer from './reducers/ui'
import { changeTitleMiddleware } from './middlewares/title'
import pageFilterMiddleware from './middlewares/pageFilter'
import appTitleReducer, { type AppTitleState } from './reducers/title'
import thunk from 'redux-thunk'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import history, { APP_PATH_PREFIX } from './history'
import CoreInstance from '../coreInstance'
import * as constants from './constants'
import { type FSA } from '../core'
import {
  notificationStorageKey,
  saveNotificationsMiddleware,
  startTimerCheckNotifications,
  unzipData
} from './middlewares/notifications'
import type { UiState } from './reducers/ui'

export type State = {
  menu: MenuState,
  appTitle: AppTitleState,
  notifications: NotificationState,
  ui: UiState
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
  connectRouter(history)(
    combineReducers({
      menu: menuReducer.reduce,
      appTitle: appTitleReducer,
      ui: uiReducer,
      notifications: notificationsReducer
    })
  ),
  {
    notifications: unzipData(localStorage.getItem(notificationStorageKey))
  },
  composeEnhancers(
    applyMiddleware(
      thunk,
      routerMiddleware(history),
      menuReducer.middleware,
      saveNotificationsMiddleware,
      changeTitleMiddleware,
      pageFilterMiddleware,
    )
  )
)

CoreInstance.subscribe('registerModule', () => {
  const modules = CoreInstance.getModules()
  for (const module of modules) {
    const added = menuReducer.processModule(module, CoreInstance.pageFilter.registerFilter)
    if (added) {
      store.dispatch({
        type: constants.RESET,
        payload: {
          namespace: module.namespace,
          path: window.location.pathname.slice(APP_PATH_PREFIX.length)
        }
      })
    }
  }
})

CoreInstance.subscribe('core:pageFilter:apply', filters => {
  store.dispatch({
    type: constants.FILTER_APPLY,
  })
  CoreInstance.dispatch('core:pageFilter:applied')
})

CoreInstance.subscribe('dispatchToken', (token: FSA) => store.dispatch(token))

startTimerCheckNotifications(store)

export default store
