// @flow
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import menuReducer, { type MenuState } from './reducers/menu'
import notificationsReducer, { type NotificationState } from './reducers/notifications'
import uiReducer from './reducers/ui'
import { changeTitleMiddleware } from './middlewares/title'
import pageFilterMiddleware from './middlewares/pageFilter'
import appTitleReducer, { type AppTitleState } from './reducers/title'
import thunk from 'redux-thunk'
import { connectRouter, routerMiddleware, RouterState } from 'connected-react-router'
import history, { APP_PATH_PREFIX } from './history'
import coreInstance from '../coreInstance'
import * as constants from './constants'
import Core, { type FSA } from '../core'
import {
  notificationStorageKey,
  saveNotificationsMiddleware,
  startTimerCheckNotifications,
  unzipData
} from './middlewares/notifications'
import type { UiState } from './reducers/ui'
import type { PageFilterState } from './reducers/pageFilter'
import pageFilterReducer from './reducers/pageFilter'

export type State = {
  menu: MenuState,
  appTitle: AppTitleState,
  notifications: NotificationState,
  ui: UiState,
  pageFilter: PageFilterState,
  router: RouterState
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const createCoreStore = (core: Core) => {
  const store = createStore(
    connectRouter(history)(
      combineReducers({
        menu: menuReducer.reduce,
        appTitle: appTitleReducer,
        ui: uiReducer,
        notifications: notificationsReducer,
        pageFilter: pageFilterReducer
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
        pageFilterMiddleware
      )
    )
  )

  core.subscribe('registerModule', modules => {
    for (const module of modules) {
      const added = menuReducer.processModule(module)
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

  core.subscribe('dispatchToken', (token: FSA) => store.dispatch(token))

  startTimerCheckNotifications(store)

  return store
}

export default createCoreStore(coreInstance)
