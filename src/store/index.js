// @flow
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import menuReducer, { type MenuState } from './reducers/menu'
import notificationsReducer, { type NotificationState } from './reducers/notifications'
import uiReducer, { type UiState } from './reducers/ui'
import routesReducer, { type RoutesState } from './reducers/routes'
import { changeTitleMiddleware } from './middlewares/title'
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

export type State = {
  menu: MenuState,
  appTitle: AppTitleState,
  notifications: NotificationState,
  ui: UiState,
  routes: RoutesState
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
  connectRouter(history)(
    combineReducers({
      menu: menuReducer.reduce,
      appTitle: appTitleReducer,
      ui: uiReducer,
      notifications: notificationsReducer,
      routes: routesReducer
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
      changeTitleMiddleware
    )
  )
)

CoreInstance.subscribe('registerModule', () => {
  const modules = CoreInstance.getModules()
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

CoreInstance.subscribe('dispatchToken', (token: FSA) => store.dispatch(token))

startTimerCheckNotifications(store)

export default store
