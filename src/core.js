// @flow
import React, { type ComponentType } from 'react'
import ReactDom from 'react-dom'
import * as R from 'ramda'
import history from './store/history'

export type menuItem = {
  label: string,
  path: string,
  selected: boolean,
  expanded: boolean,
  loading: boolean,
  items?: Array<menuItem>,
}

type halfMenuItem = {
  label: string,
  path: string,
}

export type FSA = {
  type: string,
  payload?: any,
  error?: boolean,
  meta?: any,
}

type menuShape = (action: FSA, state: [menuItem]) => Array<menuItem> | Array<menuItem> | Array<halfMenuItem>

const refineMenuItem = (item: menuItem | halfMenuItem) : menuItem => ({
  selected: false,
  expanded: false,
  loading: false,
  items: [],
  ...item,
})

const engineMap = {
  'react': 'react.js',
  'vue': 'vue.js',
}

type engines = $Keys<typeof engineMap>

export type module = {
  namespace: string,
  menu: menuShape,
  menuMiddleware?: (Object) => void,
  RootComponent: ComponentType<any>,
  engine: engines,
}

type moduleStatus = 'loading' | 'loaded' | 'not_loaded'

const loadEngine = (engineSrc: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.async = true
    script.src = engineSrc
    script.onload = () => {
      resolve(true)
    }
    document.body && document.body.appendChild(script)
  })
}

export default class Core {
  modules: Array<module> = []
  activeEngines: { [name: engines]: moduleStatus } = { react: 'loaded' }
  notifiers: { [string]: Array<Function> } = {}
  history = history
  header = null
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
          unwait();
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
    menu: menuShape,
    RootComponent: ComponentType<any>,
    engine: engines = 'react',
    menuMiddleware?: (Object) => void) {
    const addingModule = {
      namespace,
      menu: Array.isArray(menu) ? menu.map(refineMenuItem) : menu,
      menuMiddleware,
      RootComponent,
      engine,
    };
    this.checkNamespace(addingModule)
    this.modules.push(addingModule)
    this.fetchEnginesAndNotify()
  }
  async fetchEnginesAndNotify() {
    const currentEngines = R.uniq(this.modules.map(x => x.engine))
    let needLoad = false
    for (const curEngine of currentEngines) {
      const status = this.activeEngines[curEngine] || 'not_loaded'
      if (status !== 'loaded') {
        needLoad = true
      }
      if (status === 'not_loaded') {
        this.activeEngines[curEngine] = 'loading'
        await loadEngine(engineMap[curEngine])
        this.activeEngines[curEngine] = 'loaded'
        this.dispatch('registerModule')
      }
    }
    if (!needLoad) {
      this.dispatch('registerModule')
    }
  }
  checkNamespace(module: module) {
    const namespaces = this.modules.map(x => x.namespace)
    if (namespaces.indexOf(module.namespace) >= 0) {
      throw new Error('namespace_already_in_use')
    }
  }
  getModules() {
    return this.modules
  }
  subscribe(eventType: string, callback: Function) {
    if (!this.notifiers[eventType]) {
      this.notifiers[eventType] = []
    }
    this.notifiers[eventType].push(callback)
    return () => {
      this.notifiers[eventType] = this.notifiers[eventType].filter(f => f !== callback)
    }
  }
}

// global export
window.react = React
window.reactDom = ReactDom
