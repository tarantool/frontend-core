// @flow
import * as R from 'ramda'
import * as constants from './constants'
import noop from 'lodash/noop'
import type { menuItem, FSA, module } from '../core'

const initialState = []

type SubStore = {
  reducer: Function,
  middleware: (Object) => void,
  namespace: string,
}

const matchPath = (path, link) => {
  if (path.length === 0) {
    return false
  }
  const point = path.indexOf(link)
  return point === 0 && (link.length === path.length || path[link.length] === '/')
}

const selected = (path: string) => (menuItem: menuItem): menuItem => ({
  ...menuItem,
  expanded: menuItem.items.length > 0 ? (menuItem.path === path ? !menuItem.expanded : menuItem.expanded) : false
})
const updateLink = path => menuItem => ({ ...menuItem, selected: matchPath(path, menuItem.path) })

export const defaultReducer = (defaultState: Array<menuItem> = []) =>
  (state: Array<menuItem> = defaultState, { type, payload }: FSA): Array<menuItem> => {
    switch (type) {
      case constants.SELECT_MENU:
        if (payload && payload.path) {
          return state.map(selected(payload.path))
        } else {
          return state
        }
      case constants.LOCATION_CHANGE:
        if (payload && payload.location && payload.location.pathname) {
          return state.map(updateLink(payload.location.pathname))
        } else {
          return state
        }
      case constants.RESET:
        if (payload && payload.path) {
          return defaultState.map(updateLink(payload.path))
        } else {
          return state
        }
      default:
        return state
    }
  }

const concat = Array.prototype.concat.bind([])

export class MainReducer {
  subStores: Array<SubStore> = []
  installedStores: { [string]: true } = {}

  reduce = (state: any = initialState, { type, payload }: FSA) => {
    const subState = R.groupBy(R.prop('namespace'), state)
    switch (type) {
      case constants.RESET: {
        if (payload && payload.namespace) {
          const { namespace } = payload
          return R.compose(
            R.apply(concat),
            R.map(x => {
              if (x.namespace === namespace) {
                return x.reducer(subState[x.namespace], { type, payload }).map(z => ({ ...z, namespace }))
              }
              return subState[x.namespace]
            })
          )(this.subStores)
        } else {
          return state
        }
      }
      default: {
        return R.compose(
          R.apply(concat),
          R.map(x => {
            return x.reducer(subState[x.namespace], { type, payload }).map(z => ({ ...z, namespace: x.namespace }))
          })
        )(this.subStores)
      }
    }
  }

  middleware = (store: Object) => (next: Function) => (action: FSA) => {
    R.map(R.prop('middleware'), this.subStores).forEach(m => m(action))
    next(action)
  }

  processModule = (module: module) => {
    if (this.installedStores[module.namespace]) {
      return false
    }
    const reducer = Array.isArray(module.menu) ? {
      state: module.menu,
      reducer: defaultReducer(module.menu),
      middleware: module.menuMiddleware || noop,
      namespace: module.namespace,
    } : {
      state: initialState,
      reducer: module.menu,
      middleware: module.menuMiddleware || noop,
      namespace: module.namespace,
    }
    this.subStores.push(reducer)
    this.installedStores[module.namespace] = true
    return true
  }
}

export const generateInstance = () => new MainReducer()

export default new MainReducer()
