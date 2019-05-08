import reducer, {defaultReducer, generateInstance} from './reducer'
import * as constants from './constants'
const {reduce, middleware, processModule} = reducer

test('reduce choose by part of path', () => {
  const action = {
    type: constants.LOCATION_CHANGE,
    payload: {
      location: {
        pathname: '/space_explorer/hosts',
      },
    },
  };

  const state = [{
    label: 'space_explorer',
    path: '/space_explorer',
    selected: false,
    expanded: false,
    loading: false,
    items: [],
  }];

  const newState = defaultReducer()(state, action);

  expect(newState[0].selected).toBe(true);
})

test('reduce choose by full path', () => {
  const action = {
    type: constants.LOCATION_CHANGE,
    payload: {
      location: {
        pathname: '/space_explorer',
      },
    },
  };

  const state = [{
    label: 'space_explorer',
    path: '/space_explorer',
    selected: false,
    expanded: false,
    loading: false,
    items: [],
  }];

  const newState = defaultReducer()(state, action);

  expect(newState[0].selected).toBe(true);
})

test('reduce not choose', () => {
  const action = {
    type: constants.LOCATION_CHANGE,
    payload: {
      location: {
        pathname: '/',
      },
    },
  };

  const state = [{
    label: 'space_explorer',
    path: '/space_explorer',
    selected: false,
    expanded: false,
    loading: false,
    items: [],
  }];

  const newState = defaultReducer()(state, action);

  expect(newState[0].selected).toBe(false);
})

test('menu reducer function', () => {
  const reducerInstance = generateInstance();
  const equalData = [{
    label: 'test',
    path: '/test',
    selected: true,
    expanded: false,
    loading: false,
    items: [],
  }];
  const testModule = {
    namespace: 'test',
    menu: () => equalData.slice(0),
    RootComponent: () => null,
    engine: 'react',
  }
  reducerInstance.processModule(testModule)
  const reducedData = reducerInstance.reduce([], {type: 'NOTHING_CASE'})

  expect(reducedData).toEqual(equalData.map(item => ({...item, namespace: 'test'})));
})

test('menu middleware function call', () => {
  const middlewareFunction = jest.fn();
  const nextFn = jest.fn();
  const reducerInstance = generateInstance();
  const equalData = [{
    label: 'test',
    path: '/test',
    selected: true,
    expanded: false,
    loading: false,
    items: [],
  }];
  const testModule = {
    namespace: 'test',
    menu: () => equalData.slice(0),
    menuMiddleware: middlewareFunction,
    RootComponent: () => null,
    engine: 'react',
  }
  reducerInstance.processModule(testModule)

  reducerInstance.middleware([])(nextFn)({type: 'SOME_ACTION'})
  const reducedData = reducerInstance.reduce([], {type: 'SOME_ACTION'})
  expect(reducedData).toEqual(equalData.map(item => ({...item, namespace: 'test'})));
  expect(nextFn).toBeCalled()
  expect(middlewareFunction).toBeCalled()
})
