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

const didPromiseResolve = async (promiseToTest, timeout = 0) => {
  let didResolve = false;
  promiseToTest.then(() => didResolve = true);

  return new Promise(resolve => {
    setTimeout(() => {
      resolve(didResolve);
    }, timeout)
  });
};

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

  it('should accept module with other namespace', () => {
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

// Core.setHeaderComponent(headerComponent: any) {}


describe('subscribe() and dispatch()', () => {
  it('should pass dispatched data to subscribed callback', () => {
    const core = new Core();
    const eventType = 'some-event';
    const eventData1 = {};
    const eventData2 = {};

    const handler = jest.fn();
    core.subscribe(eventType, handler);

    core.dispatch(eventType, eventData1);
    expect(handler.mock.calls[0][0]).toBe(eventData1);

    core.dispatch(eventType, eventData2);
    expect(handler.mock.calls[1][0]).toBe(eventData2);
  });

  it('should NOT call listerens of other events', () => {
    const core = new Core();
    const eventTypeDispatched = 'some-event';
    const eventTypeOther = 'other-event';

    const handlerForDispatchedEvent = jest.fn();
    const handlerForOtherEvent = jest.fn();
    core.subscribe(eventTypeDispatched, handlerForDispatchedEvent);
    core.subscribe(eventTypeOther, handlerForOtherEvent);

    core.dispatch(eventTypeDispatched);
    expect(handlerForDispatchedEvent).toBeCalled();
    expect(handlerForOtherEvent).not.toBeCalled();
  });

});


describe('waitForModule()', () => {
  const module = genModuleWithNamespace('some-namespace');

  it('should resolve promise, when module with desired namespace is registered', () => {
    const core = new Core();
    const waitPromise = core.waitForModule(module.namespace)

    registerModule(core, module);
    return expect(didPromiseResolve(waitPromise)).resolves.toBe(true);
  });

  it(
    'should NOT resolve promise, when module with other namespace is registered',
    () => {
      const core = new Core();
      const waitPromise = core.waitForModule('namespace')
      const module = genModuleWithNamespace('other-namespace');

      registerModule(core, module);
      return expect(didPromiseResolve(waitPromise)).resolves.toBe(false);
    }
  );

});
