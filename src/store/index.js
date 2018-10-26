import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import mainReducer from './reducer'
import thunk from 'redux-thunk'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import history from './history'
import CoreInstance from '../coreInstance'
import * as constants from './constants'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
  connectRouter(history)(combineReducers({menu: mainReducer.reduce})),
  composeEnhancers(applyMiddleware(thunk, routerMiddleware(history), mainReducer.middleware))
)

CoreInstance.subscribe('registerModule', () => {
  const modules = CoreInstance.getModules()
  for (const module of modules) {
    const added = mainReducer.processModule(module)
    if (added) {
      store.dispatch({type: constants.RESET, payload: {namespace: module.namespace}})
    }
  }
})

export default store
