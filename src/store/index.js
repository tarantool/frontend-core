import { createStore, applyMiddleware, compose } from 'redux'
import mainReducer from './reducers'
import { load, save } from 'redux-localstorage-simple'
import thunk from 'redux-thunk'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import history from './history'
import CoreInstance from '../coreInstance'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
  connectRouter(history)(mainReducer.reduce),
  composeEnhancers(applyMiddleware(thunk, routerMiddleware(history)))
)

CoreInstance.subscribe(() => {
  const modules = CoreInstance.getModules()
  const menuReducers = modules.map(x => x.menu)
  for (const menuReducer of menuReducers) {
    mainReducer.addUnusedReducer(menuReducer)
  }
})

export default store
