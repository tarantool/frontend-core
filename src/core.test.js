// @flow
import { selectCurrentMenuItemLabel } from './store/selectors'
import store from './store/index'
import core from './coreInstance'
// - - -

import Core, {
  type MenuItemType,
  type FSA,
  type CoreModule,
} from './core'

// global import
const React = window.react;
const ReactDom = window.reactDom;


// Core.activeEngines: { [name: engines]: moduleStatus }
// Core.apiMethods = {
//   apolloLinkAfterware,
//   apolloLinkMiddleware,
//   apolloLinkOnError,
//   axiosWizard,
//   registerApolloHandler,
//   registerAxiosHandler,
// }
// Core.analyticModule

const Root = () => <div></div>;
const genModuleWithNamespace = (namespace): CoreModule => ({
  namespace,
  menu: ([]: any),
  RootComponent: Root,
  engine: 'react',
});
const registerModule = (core, module) => core.register(
  module.namespace,
  module.menu,
  module.RootComponent,
  module.engine,
  module.menuMiddleware,
  module.menuFilter
);


describe('checkNamespaces()', () => {
  const core = new Core();

  const module = genModuleWithNamespace('some-namespace');

  registerModule(core, module);
  
  it('should reject module with used namespace', () => {
    const moduleWithSameNamespace = genModuleWithNamespace(module.namespace);
    expect(() => core.checkNamespace(moduleWithSameNamespace)).toThrow();
  });

  it('should accept module with other (used for the first time) namespace', () => {
    const otherModule = genModuleWithNamespace('other-namespace');
    expect(() => core.checkNamespace(otherModule)).not.toThrow();
  });
});


describe('register()', () => {
  const core = new Core();

  const module = genModuleWithNamespace('some-namespace');

  registerModule(core, module);
  
  it('should reject module with used namespace', () => {
    const moduleWithSameNamespace = genModuleWithNamespace(module.namespace);
    expect(() => registerModule(core, moduleWithSameNamespace)).toThrow();
  });

  it('should accept module with other (used for the first time) namespace', () => {
    const otherModule = genModuleWithNamespace('other-namespace');
    expect(() => registerModule(core, otherModule)).not.toThrow();
  });
});


// Core.components = {}
// Core.constructor()

// Core.dispatch(eventType: string, event: ?Object = null) {}

// // async
// Core.fetchEnginesAndNotify() {}

// Core.getHeaderComponent() {}
// Core.getModules() {}

// Core.header
// Core.history

// Core.logo

// Core.modules

// Core.notifiers: { [string]: Array<Function> }
// Core.notify()

// Core.pageFilter = {
//   registerFilter,
//   getFilters,
//   applyFilters,
//   filterPage
// }

// Core.register() {}

// Core.setHeaderComponent(headerComponent: any) {}
// Core.subscribe(eventType: string, callback: Function) {}

// Core.waitForModule(namespace: string): Promise < boolean > {}  

