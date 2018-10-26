// @flow
import * as R from 'ramda'
import * as constants from './constants'
import noop from 'lodash/noop'

const initialState = []

type SubStore = {
  reducer: (Object, Object) => Object,
  middleware: (Object) => void,
  namespace: string,
}
const subStores: Array<SubStore> = []
const installedStores: {[string]: true} ={}
const initedReducers = []

const matchPath = (path, link) => {
  const point = link.indexOf(path)
  return point === 0 && (link.length === path.length || link[path.length] === '/')
}

const selected = path => menuItem => ({
  ...menuItem,
  expanded: menuItem.items.length > 0 ?( menuItem.path === path ? !menuItem.expanded : menuItem.expanded) : false,
})
const updateLink = path => menuItem => ({...menuItem, selected: matchPath(path, menuItem.path)})

const defaultReducer = (defaultState = []) => (state = defaultState, {type, payload}) => {
  console.log('default reducer', state, type, payload, defaultState)
  switch (type) {
    case constants.SELECT_MENU:
      return state.map(selected(payload.path))
    case '@@router/LOCATION_CHANGE':
      return state.map(updateLink(payload.location.pathname))
    case constants.RESET:
      return defaultState
    default:
      return state
  }
}

const regNameExp = /\/([^\/])\//
const getNamespaceFromPath = (path) => {
  regNameExp.exec(path)
}

const concat = Array.prototype.concat.bind([])

export default {
  reduce(state = initialState, {type, payload}) {
    const subState = R.groupBy(R.prop('namespace'), state)
    switch (type) {
      case constants.RESET: {
        const {namespace} = payload;
        return R.compose(
          R.apply(concat),
          R.map(x => {
            if (x.namespace === namespace) {
              return x.reducer(subState[x.namespace], { type, payload }).map(z => ({...z, namespace}))
            }
            return subState[x.namespace]
          })
        )(subStores)
      }
      default: {

        const res = R.compose(
          R.apply(concat),
          R.map(x => {
            return x.reducer(subState[x.namespace], { type, payload }).map(z => ({...z, namespace: x.namespace}))
          })
        )(subStores)
        return res
      }
    }
  },
  middleware: store => next => action => {
    R.map(R.prop('middleware'), subStores).forEach(m => m(action))
    next(action)
  },
  processModule(module) {
    if (installedStores[module.namespace]) {
      return false
    }
    const reducer = Array.isArray(module.menu) ? {
      state: module.menu,
      reducer: defaultReducer(module.menu),
      middleware: module.middleware || noop,
      namespace: module.namespace,
    } : {
      state: initialState,
      reducer: module.menu,
      middleware: module.middleware || noop,
      namespace: module.namespace,
    }
    console.log(reducer)
    subStores.push(reducer)
    installedStores[module.namespace] = true
    return true
  }
}
