// @flow
import * as React from "react"
import * as R from 'ramda'

type menuItem = {
  label: string,
  path: string,
  selected: boolean,
  expanded: boolean,
  loading: boolean,
  items: [menuItem]
}
type FSA = {type: string, payload: Object, error?: string}
type menuShape = (action: FSA, state: [menuItem]) => [menuItem] | [menuItem]

type module = {
  namespace: string,
  menu: menuShape,
  RootComponent: React.ComponentType<any>,
  engine: engines
}

type moduleStatus = 'loading' | 'loaded' | 'not_loaded'

const engineMap = {
  'react': 'react.js',
  'vue': 'vue.js'
}

type engines = $Keys<typeof engineMap>

const loadEngine = (engineSrc: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.async = true
    script.src = engineSrc
    script.onload = () => {
      resolve(true)
      document.body && document.body.removeChild(script)
    }
    document.body && document.body.appendChild(script)
  })
}

export default class Core {
  modules : Array<module>  = []
  activeEngines : {[name: engines]: moduleStatus} = {}
  notifiers: Array<Function> = []
  register(namespace: string, menu: menuShape, RootComponent: React.ComponentType<any>, engine: engines='react'){
    const addingModule = {
      namespace,
      menu,
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
      if (status !== 'loaded')
        needLoad = true
      if (status === 'not_loaded') {
        this.activeEngines[curEngine] = 'loading'
        await loadEngine(engineMap[curEngine])
        this.activeEngines[curEngine] = 'loaded'
        this.notify()
      }
    }
    if (!needLoad)
    {
      this.notify()
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
  subscribe(fn: Function) {
    this.notifiers.push(fn)
  }
  notify() {
    this.notifiers.forEach( (fn: Function) => fn())
  }
}
