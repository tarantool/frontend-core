// @flow
import type { ComponentType } from 'react';
import { createElement } from 'react';
import ReactDOM from 'react-dom';
import type { ReactComponentLike } from 'prop-types';

import pkg from '../package.json';
import { generateAnalyticModule } from './analytics';
import { generateApiMethod } from './api';
import App from './App';
import logo from './assets/tarantool-logo-full.svg';
import AppTitle from './components/AppTitle';
import { generateFilterApi } from './pageFilter';
import type { PageFilterType } from './pageFilter';
import { createCoreStore } from './store';
import { sendNotification } from './store/actions/notifications';
import { createHistory } from './store/history';
import { createStorage } from './utils/storage';

export type MenuItemTypes = 'internal' | 'external';

export type MenuItemType = {|
  label: string,
  path: string,
  selected: boolean,
  expanded: boolean,
  loading: boolean,
  icon: string | Object,
  items?: Array<MenuItemType>,
  type?: MenuItemTypes,
  pinBottom?: boolean,
|};

export type HalfMenuItem = {|
  label: string,
  path: string,
  icon?: string | Object,
  items?: Array<HalfMenuItem>,
  type?: 'internal' | 'external',
  pinBottom?: boolean,
|};

export type FSA = {
  type: string,
  payload?: any,
  error?: boolean,
  meta?: any,
};

type MenuShape = ((action: FSA, state: [MenuItemType]) => Array<MenuItemType>) | Array<MenuItemType>;

type InputMenuShape =
  | ((action: FSA, state: [MenuItemType]) => Array<MenuItemType>)
  | Array<MenuItemType | HalfMenuItem>;

export const refineMenuItem = (item: MenuItemType | HalfMenuItem): MenuItemType => {
  if (item.expanded) {
    return {
      selected: false,
      expanded: false,
      loading: false,
      items: [],
      icon: 'menu',
      ...item,
    };
  }

  const items: Array<MenuItemType> = [];

  for (const i of item.items || []) {
    items.push(refineMenuItem(i));
  }

  return {
    selected: false,
    expanded: false,
    loading: false,
    items,
    icon: item.icon || 'menu',
    label: item.label,
    path: item.path,
    type: item.type,
    pinBottom: item.pinBottom,
  };
};

export type CoreModule = {
  namespace: string,
  menu: MenuShape,
  RootComponent: ComponentType<any>,
  menuMiddleware?: (Object) => void,
};

export type InputCoreModule = {
  namespace: string,
  menu: InputMenuShape,
  RootComponent: ComponentType<any>,
  menuMiddleware?: (Object) => void,
};

export default class Core {
  logo = logo;
  version = pkg.version;
  components = {
    AppTitle,
  };

  store: Object;
  modules: Array<CoreModule> = [];
  notifiers: { [string]: Array<Function> } = {};
  header: ?ReactComponentLike = null;
  history: History = createHistory();
  ls = createStorage('local');
  ss = createStorage('session');

  apiMethods = generateApiMethod();
  analyticModule = generateAnalyticModule();
  pageFilter: PageFilterType = generateFilterApi(this);

  constructor({ store }: { store?: Object } = {}) {
    this.store = store || createCoreStore(this);
  }

  /**
   * @deprecated since v6.5.x (april 2020)
   */
  setHeaderComponent(headerComponent: any) {
    this.header = headerComponent;
    this.dispatch('setHeaderComponent');
  }

  getHeaderComponent(): ?ReactComponentLike {
    return this.header;
  }

  get variables() {
    return typeof window === 'undefined' ? {} : window.__tarantool_variables || {};
  }

  get adminPrefix() {
    return typeof window === 'undefined' ? '' : window.__tarantool_admin_prefix || '';
  }

  waitForModule(namespace: string): Promise<boolean> {
    return new Promise((resolve) => {
      const unsubscribe = this.subscribe('registerModule', () => {
        const modules = this.getModules().filter((x) => x.namespace === namespace);
        if (modules.length > 0) {
          unsubscribe();
          resolve(true);
        }
      });
    });
  }

  dispatch(eventType: string, event: ?Object = null) {
    if (!this.notifiers[eventType]) {
      this.notifiers[eventType] = [];
    }
    for (const callback of this.notifiers[eventType]) {
      callback(event);
    }
  }

  /**
   * @deprecated Use registerModule instead
   */
  register(
    namespace: string,
    menu: InputMenuShape,
    RootComponent: ComponentType<any>,
    /**
     * @TODO remove "engine". Engines are deprecated since v6.5.x (april 2020),
     * we decided to use only React
     */
    engine?: string = 'react',
    menuMiddleware?: (Object) => void
  ) {
    void engine;
    return this.registerModule({
      namespace,
      menu,
      menuMiddleware,
      RootComponent,
    });
  }

  registerModule({
    namespace,
    menu,
    RootComponent,
    menuMiddleware,
  }: {
    namespace: string,
    menu: InputMenuShape,
    RootComponent: ComponentType<any>,
    menuMiddleware?: (Object) => void,
  }) {
    const addingModule: CoreModule = {
      namespace,
      menu: Array.isArray(menu) ? menu.map(refineMenuItem) : menu,
      menuMiddleware,
      RootComponent,
    };
    this.checkNamespace(addingModule);
    this.modules.push(addingModule);
    this.dispatch('registerModule', this.getModules());
  }

  checkNamespace(module: CoreModule | InputCoreModule) {
    const namespaces = this.modules.map((x) => x.namespace);
    if (namespaces.indexOf(module.namespace) >= 0) {
      throw new Error('namespace_already_in_use');
    }
  }

  getModules() {
    return this.modules;
  }

  /**
   * @return Unsubscribe function
   */
  subscribe(eventType: string, callback: Function) {
    if (!this.notifiers[eventType]) {
      this.notifiers[eventType] = [];
    }
    this.notifiers[eventType].push(callback);
    return () => {
      this.notifiers[eventType] = this.notifiers[eventType].filter((f) => f !== callback);
    };
  }

  notify({
    type,
    title,
    message,
    details,
    timeout,
  }: {
    type: 'default' | 'success' | 'error',
    title: string,
    message?: string,
    details?: string,
    timeout?: number,
  }) {
    this.dispatch('dispatchToken', sendNotification({ type, title, message, details, timeout }));
  }

  install() {
    const root = document.getElementById('root');
    if (root) {
      ReactDOM.render(createElement(App, { store: this.store, core: this }), root);
    } else {
      throw new Error(`Unable to find the root element (#root)`);
    }
  }
}
