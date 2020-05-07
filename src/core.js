// @flow
import React, { type ComponentType } from 'react'
import ReactDom from 'react-dom'
import { createHistory } from './store/history'
import { sendNotification } from './store/actions/notifications'
import pageFilter from './pageFilter'
import { ReactComponentLike } from 'prop-types'
import type { PageFilterType } from './pageFilter'

export type MenuItemType = {|
  label: string,
  path: string,
  selected: boolean,
  expanded: boolean,
  loading: boolean,
  icon: string | Object,
  items?: Array<MenuItemType>
|}

type halfMenuItem = {|
  label: string,
  path: string,
  icon?: string | Object,
  items?: Array<halfMenuItem>
|}

export type FSA = {
  type: string,
  payload?: any,
  error?: boolean,
  meta?: any
}

type menuShape = ((action: FSA, state: [MenuItemType]) => Array<MenuItemType>)
  | Array<MenuItemType>

type inputMenuShape = ((action: FSA, state: [MenuItemType]) => Array<MenuItemType>)
  | Array<MenuItemType | halfMenuItem>

export const refineMenuItem = (item: MenuItemType | halfMenuItem): MenuItemType => {
  if (item.expanded) {
    return {
      selected: false,
      expanded: false,
      loading: false,
      items: [],
      icon: 'menu',
      ...item
    }
  }

  const items : Array<MenuItemType> = []

  for (const i of (item.items || [])) {
    items.push(refineMenuItem(i))
  }

  return {
    selected: false,
    expanded: false,
    loading: false,
    items,
    icon: item.icon || 'menu',
    label: item.label,
    path: item.path
  }
}

export type CoreModule = {
  namespace: string,
  menu: menuShape,
  menuMiddleware?: Object => void,
  RootComponent: ComponentType<any>,
}

export type InputCoreModule = {
  namespace: string,
  menu: inputMenuShape,
  menuMiddleware?: Object => void,
  RootComponent: ComponentType<any>,
}

export default class Core {
  modules: Array<CoreModule>
  notifiers: { [string]: Array<Function> }
  history: History
  header: ?ReactComponentLike
  pageFilter: PageFilterType
  constructor() {
    this.modules = []
    this.notifiers = {}
    this.history = createHistory()
    this.header = null
    this.pageFilter = pageFilter(this)
  }

  /**
   * @deprecated since v6.5.x (april 2020)
   */
  setHeaderComponent(headerComponent: any) {
    this.header = headerComponent
    this.dispatch('setHeaderComponent')
  }
  getHeaderComponent() {
    return this.header
  }
  waitForModule(namespace: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const unwait = this.subscribe('registerModule', () => {
        const modules = this.getModules().filter(x => x.namespace === namespace)
        if (modules.length > 0) {
          unwait()
          resolve(true)
        }
      })
    })
  }
  dispatch(eventType: string, event: ?Object = null) {
    if (!this.notifiers[eventType]) {
      this.notifiers[eventType] = []
    }
    for (const callback of this.notifiers[eventType]) {
      callback(event)
    }
  }
  register(
    namespace: string,
    menu: inputMenuShape,
    RootComponent: ComponentType<any>,
    /**
     * @TODO remove "engine". Engines are deprecated since v6.5.x (april 2020),
     * we desided to use only React
     */
    engine: string,
    menuMiddleware?: Object => void
  ) {
    return this.registerModule({
      namespace,
      menu,
      menuMiddleware,
      RootComponent
    })
  }
  registerModule({
    namespace,
    menu,
    RootComponent,
    menuMiddleware
  }: {
    namespace: string,
    menu: inputMenuShape,
    RootComponent: ComponentType<any>,
    menuMiddleware?: Object => void
  }) {
    const addingModule: CoreModule = {
      namespace,
      menu: Array.isArray(menu) ? menu.map(refineMenuItem) : menu,
      menuMiddleware,
      RootComponent
    }
    this.checkNamespace(addingModule)
    this.modules.push(addingModule)
    this.dispatch('registerModule', this.getModules())
  }
  checkNamespace(module: CoreModule | InputCoreModule) {
    const namespaces = this.modules.map(x => x.namespace)
    if (namespaces.indexOf(module.namespace) >= 0) {
      throw new Error('namespace_already_in_use')
    }
  }
  getModules() {
    return this.modules
  }
  /**
   * @return Unsubscribe function
   */
  subscribe(eventType: string, callback: Function) {
    if (!this.notifiers[eventType]) {
      this.notifiers[eventType] = []
    }
    this.notifiers[eventType].push(callback)
    return () => {
      this.notifiers[eventType] = this.notifiers[eventType].filter(f => f !== callback)
    }
  }
  notify({
    type,
    title,
    message,
    timeout
  }: {
    type: 'default' | 'success' | 'error',
    title: string,
    message?: string,
    timeout?: number
  }) {
    this.dispatch('dispatchToken', sendNotification({ type, title, message, timeout }))
  }
}

// global export
window.react = React
window.reactDom = ReactDom
