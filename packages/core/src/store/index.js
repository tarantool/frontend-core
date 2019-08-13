// @flow
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import mainReducer, { type MenuState } from './reducer';
import { changeTitleMiddleware } from './title/middleware';
import appTitleReducer, { type AppTitleState } from './title/reducer';
import thunk from 'redux-thunk';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import history, { APP_PATH_PREFIX } from './history';
import CoreInstance from '../coreInstance';
import * as constants from './constants';
import { type FSA } from '../core';

export type State = {
  menu: MenuState,
  appTitle: AppTitleState
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  connectRouter(history)(combineReducers({
    menu: mainReducer.reduce,
    appTitle: appTitleReducer,
  })),
  composeEnhancers(applyMiddleware(thunk, routerMiddleware(history), mainReducer.middleware, changeTitleMiddleware))
);

CoreInstance.subscribe('registerModule', () => {
  const modules = CoreInstance.getModules();
  for (const module of modules) {
    const added = mainReducer.processModule(module);
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

CoreInstance.subscribe('dispatchToken', (token: FSA) => store.dispatch(token));

export default store;
