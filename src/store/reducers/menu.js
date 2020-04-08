// @flow
import * as R from 'ramda'
import * as constants from '../constants'
import noop from 'lodash/noop'
import type { MenuItemType, FSA, CoreModule } from '../../core'

const initialState = []

export type MenuState = MenuItemType[]

type SubStore = {
  reducer: Function,
  middleware: Object => void,
  namespace: string
}

const mapMenuTree = (menuState: MenuItemType[], fn: (item: MenuItemType) => MenuItemType) => {
  const stack = [...menuState.map(fn)]
  const result = [...stack]

  for (let i = 0; i < stack.length; i++) {
    const menuItem = stack[i]
    if (menuItem.items) {
      menuItem.items = [...menuItem.items.map(fn)]
      stack.push(...menuItem.items)
    }
  }

  return result
}

export const matchPath = (path: ?string, link: string, exact: boolean = false): boolean => {
  if (!path || path.length === 0) {
    return false
  }

  path = path.split('?')[0]
  path = R.last(path) === '/' ? path.slice(0, -1) : path

  return link === path || (!exact && path.indexOf(link) === 0 && path[link.length] === '/')
}

const getStrongestMatchingLink = (state: MenuItemType[], path: string): ?string => {
  let selected = null
  const flattened = [...state]

  for (let i = 0; i < flattened.length; i++) {
    const item = flattened[i]

    if (item && item.items && item.items.length) {
      flattened.push(...item.items)
    }

    const matched = matchPath(path, item.path)

    if (matched && (!selected || selected.length < item.path.length)) {
      selected = item.path
    }
  }

  return selected
}

const updateLink = (activeLink: ?string) => (menuItem: MenuItemType): MenuItemType => {
  const { items = [], path } = menuItem
  const isPatchMatching: boolean = activeLink ? matchPath(activeLink, path) : false

  return {
    ...menuItem,
    expanded: isPatchMatching && !!items.length,
    selected: activeLink ? matchPath(activeLink, path, true) : false
  }
}

const expand = (activeLink: ?string) => (menuItem: MenuItemType): MenuItemType => {
  const { path } = menuItem

  return {
    ...menuItem,
    expanded: matchPath(activeLink, path, true)
  }
}

export const defaultReducer = (defaultState: MenuState = []) => (
  state: MenuState = defaultState,
  { type, payload }: FSA
): MenuState => {
  switch (type) {
    case constants.LOCATION_CHANGE:
      if (payload && payload.location && payload.location.pathname) {
        const activeLink = getStrongestMatchingLink(state, payload.location.pathname)
        return mapMenuTree(state, updateLink(activeLink))
      } else {
        return state
      }

    case constants.EXPAND:
      if (payload && payload.location && payload.location.pathname) {
        const activeLink = getStrongestMatchingLink(state, payload.location.pathname)
        return mapMenuTree(state, expand(activeLink))
      } else {
        return state
      }

    case constants.RESET:
      if (payload && payload.path) {
        const activeLink = getStrongestMatchingLink(state, payload.path)
        return mapMenuTree(defaultState, updateLink(activeLink))
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
  filters: Array<(MenuItemType) => boolean> = [R.T]
  reduce = (state: any = initialState, { type, payload }: FSA) => {
    const subState = R.groupBy(R.prop('namespace'), state)
    switch (type) {
      case constants.RESET: {
        if (payload && payload.namespace) {
          const { namespace } = payload
          return R.compose(
            R.compose(...this.filters.map(filter => R.filter(filter))),
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
          R.compose(...this.filters.map(filter => R.filter(filter))),
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
    return next(action)
  }

  processModule = (module: CoreModule) => {
    if (this.installedStores[module.namespace]) {
      return false
    }
    const reducer = Array.isArray(module.menu)
      ? {
        state: module.menu,
        reducer: defaultReducer(module.menu),
        middleware: module.menuMiddleware || noop,
        namespace: module.namespace
      }
      : {
        state: initialState,
        reducer: module.menu,
        middleware: module.menuMiddleware || noop,
        namespace: module.namespace
      }
    this.subStores.push(reducer)
    this.installedStores[module.namespace] = true

    return true
  }
}

export const generateInstance = () => new MainReducer()

export default new MainReducer()
