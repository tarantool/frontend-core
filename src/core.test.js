/* eslint-disable sonarjs/no-duplicate-string */
// @flow
import Core from './core';
import type { InputCoreModule } from './core';
import { didPromiseResolve } from './test-utils/promise';

const RootComponent = () => '';
const genModuleWithNamespace = (namespace: string): InputCoreModule => ({
  namespace,
  menu: [],
  RootComponent,
});

describe('checkNamespaces()', () => {
  const core = new Core();

  const module = genModuleWithNamespace('some-namespace');
  core.registerModule(module);

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
  core.registerModule(module);

  it('should reject module with used namespace', () => {
    const moduleWithSameNamespace = genModuleWithNamespace(module.namespace);
    expect(() => core.registerModule(moduleWithSameNamespace)).toThrow();
  });

  it('should accept module with other namespace', () => {
    const otherModule = genModuleWithNamespace('other-namespace');
    expect(() => core.registerModule(otherModule)).not.toThrow();
  });

  it('should dispatch "registerModule" event on module register', () => {
    const fnRegister = jest.fn();
    core.subscribe('registerModule', fnRegister);

    core.registerModule(genModuleWithNamespace('namespace-1'));
    expect(fnRegister).toBeCalledTimes(1);

    core.registerModule(genModuleWithNamespace('namespace-2'));
    expect(fnRegister).toBeCalledTimes(2);
  });
});

describe('registerModule()', () => {
  it('should register module', () => {
    const core = new Core();
    const module = genModuleWithNamespace('some-namespace');
    core.registerModule(module);

    expect(core.getModules()[0].namespace).toBe('some-namespace');
  });

  it('should reject module with used namespace', () => {
    const core = new Core();

    const module = genModuleWithNamespace('some-namespace');
    core.registerModule(module);
    const moduleWithSameNamespace = genModuleWithNamespace(module.namespace);
    expect(() => core.registerModule(moduleWithSameNamespace)).toThrow();
  });

  it('should accept module with other namespace', () => {
    const core = new Core();
    const module = genModuleWithNamespace('some-namespace');
    core.registerModule(module);
    const otherModule = genModuleWithNamespace('other-namespace');
    expect(() => core.registerModule(otherModule)).not.toThrow();
  });

  it('should dispatch "registerModule" event on module register', () => {
    const core = new Core();
    const fnRegister = jest.fn();
    core.subscribe('registerModule', fnRegister);

    core.registerModule(genModuleWithNamespace('namespace-1'));
    expect(fnRegister).toBeCalledTimes(1);

    core.registerModule(genModuleWithNamespace('namespace-2'));
    expect(fnRegister).toBeCalledTimes(2);
  });
});

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

  it('should NOT call listeners of other events', () => {
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
    const waitPromise = core.waitForModule(module.namespace);

    core.registerModule(module);
    return expect(didPromiseResolve(waitPromise)).resolves.toBe(true);
  });

  it('should NOT resolve promise, when module with other namespace is registered', () => {
    const core = new Core();
    const waitPromise = core.waitForModule('namespace');
    const module = genModuleWithNamespace('other-namespace');

    core.registerModule(module);
    return expect(didPromiseResolve(waitPromise)).resolves.toBe(false);
  });
});

describe('reactTreeKey and core:updateReactTreeKey event', () => {
  it('should increase the value of the core.reactTreeKey property on the core:updateReactTreeKey event', () => {
    const core = new Core();
    expect(core.reactTreeKey).toBe(0);
    core.dispatch('core:updateReactTreeKey');
    expect(core.reactTreeKey).toBe(1);
    expect(core.reactTreeKey).toBe(1);
    core.dispatch('core:updateReactTreeKey');
    expect(core.reactTreeKey).toBe(2);
  });
});
