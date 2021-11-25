/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import type { ComponentType } from 'react';
import type { History } from 'history';

export declare type MenuItemTypes = 'internal' | 'external';

export declare type MenuItemType = {
  label: string;
  path: string;
  selected: boolean;
  expanded: boolean;
  loading: boolean;
  icon: string | Object;
  items?: Array<MenuItemType>;
  type?: MenuItemTypes;
  pinBottom?: boolean;
};

export declare type HalfMenuItem = {
  label: string;
  path: string;
  icon?: string | Object;
  items?: Array<HalfMenuItem>;
  type?: MenuItemTypes;
  pinBottom?: boolean;
};

export declare type FSA = {
  type: string;
  payload?: any;
  error?: boolean;
  meta?: any;
};

export declare type MenuShape = ((action: FSA, state: MenuItemType[]) => Array<MenuItemType>) | Array<MenuItemType>;

export declare type InputMenuShape =
  | ((action: FSA, state: MenuItemType[]) => Array<MenuItemType>)
  | Array<MenuItemType | HalfMenuItem>;

export declare type CoreModule = {
  namespace: string;
  menu: MenuShape;
  menuMiddleware?: (value: Object) => void;
  RootComponent: ComponentType;
};

export declare type InputCoreModule = {
  namespace: string;
  menu: InputMenuShape;
  header: ComponentType | null | undefined;
  menuMiddleware?: (value: Object) => void;
  RootComponent: ComponentType;
};

export declare type FilterFunction = (value: MenuItemType) => boolean;

export declare type PageFilterType = {
  registerFilter: (filter: FilterFunction) => Function;
  getFilters: () => Array<FilterFunction>;
  applyFilters: (filters: Array<MenuItemType>) => Array<MenuItemType>;
  filterPage: (menu: MenuItemType) => boolean;
};

export declare type Store = {
  get: (key: string) => string;
  set: (key: string, value: string) => void;
  remove: (key: string) => void;
};

export declare class Core {
  modules: Array<CoreModule>;
  notifiers: {
    [key: string]: Array<Function>;
  };
  pageFilter: PageFilterType;
  history: History;
  variables: Record<string, unknown>;
  adminPrefix: string;
  ls: Store;
  ss: Store;
  //
  version: string;
  logo: string;
  components: {
    AppTitle: ComponentType<{ title: string }>;
  };
  apiMethods: any;
  analyticModule: any;
  //

  /**
   * @deprecated since v6.5.x (april 2020)
   */
  setHeaderComponent(headerComponent: any): void;
  getHeaderComponent(): ComponentType | null | undefined;
  waitForModule(namespace: string): Promise<boolean>;
  install(elementId?: string): void;
  dispatch(eventType: string, event: Object | null | undefined): void;
  /**
   * @deprecated Use registerModule instead
   */
  register(
    namespace: string,
    menu: InputMenuShape,
    RootComponent: ComponentType,
    /**
     * @deprecated
     * @TODO remove "engine". Engines are deprecated since v6.5.x (april 2020),
     * we decided to use only React
     */
    engine?: string,
    menuMiddleware?: (value: Object) => void
  ): void;

  registerModule(props: {
    namespace: string;
    menu: InputMenuShape;
    RootComponent: ComponentType;
    menuMiddleware?: (value: Object) => void;
  }): void;
  checkNamespace(module: CoreModule | InputCoreModule): void;
  getModules(): CoreModule[];
  subscribe(eventType: string, callback: Function): () => void;
  notify(props: {
    type: 'default' | 'success' | 'error';
    title: string;
    message?: string | null;
    details?: string | null;
    timeout?: number | null;
  }): void;
}

export declare const core: Core;
export declare const useCore: () => Core | null;
export declare const withCore: <T extends { core: Core }>(
  component: ComponentType<T>
) => ComponentType<Omit<T, 'core'>>;
