// @flow
import { RouterState, connectRouter, routerMiddleware } from 'connected-react-router';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';

import Core from '../core';
import type { FSA } from '../core';
import { setAppName } from './actions/title';
import * as constants from './constants';
import { APP_PATH_PREFIX } from './history';
import {
  notificationStorageKey,
  saveNotificationsMiddleware,
  startTimerCheckNotifications,
  unzipData,
} from './middlewares/notifications';
import pageFilterMiddleware from './middlewares/pageFilter';
import { changeTitleMiddleware } from './middlewares/title';
import type { MenuState } from './reducers/menu';
import { generateInstance as generateMenuReducerInstance } from './reducers/menu';
import notificationsReducer from './reducers/notifications';
import type { NotificationState } from './reducers/notifications';
import type { PageFilterState } from './reducers/pageFilter';
import pageFilterReducer from './reducers/pageFilter';
import appTitleReducer from './reducers/title';
import type { AppTitleState } from './reducers/title';
import uiReducer from './reducers/ui';
import type { UiState } from './reducers/ui';

export type State = {
  menu: MenuState,
  appTitle: AppTitleState,
  notifications: NotificationState,
  ui: UiState,
  pageFilter: PageFilterState,
  router: RouterState,
};

const composeEnhancers =
  (typeof window !== 'undefined' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null) || compose;

export const createCoreStore = (core: Core) => {
  const menuReducer = generateMenuReducerInstance();
  const store = createStore(
    connectRouter(core.history)(
      combineReducers({
        menu: menuReducer.reduce,
        appTitle: appTitleReducer,
        ui: uiReducer,
        notifications: notificationsReducer,
        pageFilter: pageFilterReducer,
      })
    ),
    {
      notifications: unzipData(localStorage.getItem(notificationStorageKey)),
    },
    composeEnhancers(
      applyMiddleware(
        thunk,
        routerMiddleware(core.history),
        menuReducer.middleware,
        saveNotificationsMiddleware,
        changeTitleMiddleware,
        pageFilterMiddleware
      )
    )
  );

  core.subscribe('registerModule', (modules) => {
    for (const module of modules) {
      const added = menuReducer.processModule(module);
      if (added) {
        store.dispatch({
          type: constants.RESET,
          payload: {
            namespace: module.namespace,
            path: window.location.pathname.slice(APP_PATH_PREFIX.length),
          },
        });
      }
    }
  });

  core.subscribe('setAppName', (name: string) => {
    if (typeof name === 'string' && name) {
      store.dispatch(setAppName(name));
    }
  });

  core.subscribe('dispatchToken', (token: FSA) => store.dispatch(token));

  startTimerCheckNotifications(store);

  return store;
};
