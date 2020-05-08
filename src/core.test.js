// @flow
import Core, {
  type InputCoreModule
} from './core'
import { registerModule } from './test-utils/coreInstance'
import { didPromiseResolve } from './test-utils/promise'

const RootComponent = () => '';
const genModuleWithNamespace = (namespace): InputCoreModule => ({
  namespace,
  menu: [],
  RootComponent,
  engine: 'react'
});

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

  it('should dispatch "registerModule" event on module register', () => {
    const fnRegister = jest.fn()
    core.subscribe('registerModule', fnRegister)

    registerModule(core, genModuleWithNamespace('namespace-1'));
    expect(fnRegister).toBeCalledTimes(1)

    registerModule(core, genModuleWithNamespace('namespace-2'));
    expect(fnRegister).toBeCalledTimes(2);
  });
});

describe('resgiterModule()', () => {
  it('should register module', () => {
    const core = new Core()
    const module = genModuleWithNamespace('some-namespace')
    core.registerModule(module)

    expect(core.getModules()[0].namespace).toBe('some-namespace')
  })

  it('should reject module with used namespace', () => {
    const core = new Core();

    const module = genModuleWithNamespace('some-namespace');
    core.registerModule(module)
    const moduleWithSameNamespace = genModuleWithNamespace(module.namespace);
    expect(() => core.registerModule(moduleWithSameNamespace)).toThrow();
  });

  it('should accept module with other namespace', () => {
    const core = new Core();
    const module = genModuleWithNamespace('some-namespace');
    core.registerModule(module)
    const otherModule = genModuleWithNamespace('other-namespace');
    expect(() => core.registerModule(otherModule)).not.toThrow();
  });

  it('should dispatch "registerModule" event on module register', () => {
    const core = new Core()
    const fnRegister = jest.fn()
    core.subscribe('registerModule', fnRegister)

    core.registerModule(genModuleWithNamespace('namespace-1'))
    expect(fnRegister).toBeCalledTimes(1)

    core.registerModule(genModuleWithNamespace('namespace-2'))
    expect(fnRegister).toBeCalledTimes(2);
  });
})

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
