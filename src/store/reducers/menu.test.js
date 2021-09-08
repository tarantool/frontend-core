/* eslint-disable sonarjs/no-duplicate-string */
import { locationAction } from '../../test-utils/reduxActions';
import { defaultReducer, generateInstance, matchPath } from './menu';
// Only one level of nesting depth allowed in side menu

describe('reduce choose by part of path', () => {
  const nestedMenuState = [
    {
      label: 'space_explorer',
      path: '/space_explorer',
      selected: false,
      expanded: false,
      loading: false,
      items: [
        {
          label: 'hosts',
          path: '/space_explorer/hosts',
          selected: false,
          expanded: false,
          loading: false,
          items: [],
        },
        {
          label: 'kitties',
          path: '/space_explorer/kitties',
          selected: false,
          expanded: false,
          loading: false,
          items: [],
        },
      ],
    },
  ];

  it('without nested items', () => {
    const action = locationAction('/space_explorer/hosts');

    const state = [
      {
        label: 'space_explorer',
        path: '/space_explorer',
        selected: false,
        expanded: false,
        loading: false,
        items: [],
      },
    ];

    const newState = defaultReducer()(state, action);

    expect(newState[0].selected).toBe(true);
  });

  it('with nested items', () => {
    const action = locationAction('/space_explorer/hosts');

    const newState = defaultReducer()(nestedMenuState, action);

    expect(newState[0].selected).toBe(false);
    expect(newState[0].expanded).toBe(true);
    expect(newState[0].items[0].selected).toBe(true);
  });

  it('with nested items and deep path', () => {
    const action = locationAction('/space_explorer/spaces/space4/');

    const newState = defaultReducer()(nestedMenuState, action);

    expect(newState[0].selected).toBe(true);
    expect(newState[0].expanded).toBe(true);
    expect(newState[0].items[0].selected).toBe(false);
  });

  it('with nested items and deep path, second case', () => {
    const action = locationAction('/space_explorer/kitties/kitty4/');

    const newState = defaultReducer()(nestedMenuState, action);

    expect(newState[0].selected).toBe(false);
    expect(newState[0].expanded).toBe(true);
    expect(newState[0].items[1].selected).toBe(true);
    expect(newState[0].items[1].expanded).toBe(false);
  });
});

test('switch menu subsection on location change', () => {
  const action = locationAction('/fruits/banana');

  const state = [
    {
      label: 'Vegetables',
      path: '/vegs',
      selected: true,
      expanded: false,
      loading: false,
      items: [],
    },
    {
      label: 'Fruits',
      path: '/fruits',
      selected: false,
      expanded: false,
      loading: false,
      items: [
        {
          label: 'Fruits Banana',
          path: '/fruits/banana',
          selected: false,
          expanded: false,
          loading: false,
          items: [],
        },
        {
          label: 'Apple',
          path: '/fruits/apple',
          selected: false,
          expanded: false,
          loading: false,
          items: [],
        },
      ],
    },
    {
      label: 'Gems',
      path: '/gems',
      selected: false,
      expanded: false,
      loading: false,
      items: [],
    },
  ];

  const newState = defaultReducer()(state, action);

  expect(newState[0].selected).toBeFalsy();
  expect(newState[1].selected).toBeFalsy();
  expect(newState[1].expanded).toBeTruthy();
  expect(newState[1].items[0].selected).toBeTruthy();
  expect(newState[1].items[0].expanded).toBeFalsy();
});

test('switch menu subsection on route change', () => {
  const action = locationAction('/gems');

  const state = [
    {
      label: 'Vegetables',
      path: '/vegs',
      selected: false,
      expanded: false,
      loading: false,
      items: [],
    },
    {
      label: 'Fruits',
      path: '/fruits',
      selected: false,
      expanded: true,
      loading: false,
      items: [
        {
          label: 'Fruits Banana',
          path: '/fruits/banana',
          selected: false,
          expanded: false,
          loading: false,
          items: [],
        },
        {
          label: 'Apple',
          path: '/fruits/apple',
          selected: true,
          expanded: false,
          loading: false,
          items: [],
        },
      ],
    },
    {
      label: 'Gems',
      path: '/gems',
      selected: false,
      expanded: false,
      loading: false,
      items: [],
    },
  ];

  const newState = defaultReducer()(state, action);

  expect(newState[1].expanded).toBeFalsy();
  expect(newState[1].items[1].selected).toBeFalsy();
  expect(newState[1].items[1].expanded).toBeFalsy();
  expect(newState[2].selected).toBeTruthy();
  expect(newState[2].expanded).toBeFalsy();
});

test('reduce choose by full path', () => {
  const action = locationAction('/space_explorer');

  const state = [
    {
      label: 'space_explorer',
      path: '/space_explorer',
      selected: false,
      expanded: false,
      loading: false,
      items: [],
    },
  ];

  const newState = defaultReducer()(state, action);

  expect(newState[0].selected).toBe(true);
});

test('reduce not choose', () => {
  const action = locationAction('/');

  const state = [
    {
      label: 'space_explorer',
      path: '/space_explorer',
      selected: false,
      expanded: false,
      loading: false,
      items: [],
    },
  ];

  const newState = defaultReducer()(state, action);

  expect(newState[0].selected).toBe(false);
});

test('menu reducer function', () => {
  const reducerInstance = generateInstance();
  const equalData = [
    {
      label: 'test',
      path: '/test',
      selected: true,
      expanded: false,
      loading: false,
      items: [],
    },
  ];
  const testModule = {
    namespace: 'test',
    menu: () => equalData.slice(0),
    RootComponent: () => null,
    engine: 'react',
  };
  reducerInstance.processModule(testModule);
  const reducedData = reducerInstance.reduce([], { type: 'NOTHING_CASE' });

  expect(reducedData).toEqual(equalData.map((item) => ({ ...item, namespace: 'test' })));
});

test('menu middleware function call', () => {
  const middlewareFunction = jest.fn();
  const nextFn = jest.fn();
  const reducerInstance = generateInstance();
  const equalData = [
    {
      label: 'test',
      path: '/test',
      selected: true,
      expanded: false,
      loading: false,
      items: [],
    },
  ];
  const testModule = {
    namespace: 'test',
    menu: () => equalData.slice(0),
    menuMiddleware: middlewareFunction,
    RootComponent: () => null,
    engine: 'react',
  };
  reducerInstance.processModule(testModule);

  reducerInstance.middleware([])(nextFn)({ type: 'SOME_ACTION' });
  const reducedData = reducerInstance.reduce([], { type: 'SOME_ACTION' });
  expect(reducedData).toEqual(equalData.map((item) => ({ ...item, namespace: 'test' })));
  expect(nextFn).toBeCalled();
  expect(middlewareFunction).toBeCalled();
});

describe('matchPath', () => {
  it('match not exact', () => {
    expect(matchPath('/users/groups/groupb/', '/users')).toBeTruthy();
    expect(matchPath('/users/groups/groupb', '/users/groups')).toBeTruthy();
    expect(matchPath('/users/groups/groupb?extended=true&hidden=false', '/users/groups')).toBeTruthy();

    expect(matchPath('/users/groups', '/users/groups/groupb')).toBeFalsy();
    expect(matchPath('/users/groups/', '/users/groups/groupb')).toBeFalsy();
    expect(matchPath('/users/groups?extended=true&hidden=false', '/users/groups/groupb')).toBeFalsy();
  });

  it('match exact', () => {
    expect(matchPath('/users/groups/', '/users/groups', true)).toBeTruthy();
    expect(matchPath('/users/groups', '/users/groups', true)).toBeTruthy();
    expect(matchPath('/users/groups/?extended=true&hidden=false', '/users/groups', true)).toBeTruthy();
    expect(matchPath('/users/groups?extended=true&hidden=false', '/users/groups', true)).toBeTruthy();

    expect(matchPath('/users/groups/groupb/', '/users', true)).toBeFalsy();
    expect(matchPath('/users/groups/groupb', '/users/groups', true)).toBeFalsy();
    expect(matchPath('/users/groups/groupb?extended=true&hidden=false', '/users/groups', true)).toBeFalsy();
  });
  it('should be one selected menu', () => {
    const reducerInstance = generateInstance();

    const first = {
      namespace: 'first',
      menu: [
        {
          label: 'first',
          path: '/first',
          selected: false,
          expanded: false,
          loading: false,
          items: [],
        },
      ],
      RootComponent: () => null,
      engine: 'react',
    };
    const second = {
      namespace: 'second',
      menu: [
        {
          label: 'second',
          path: '/second',
          selected: false,
          expanded: false,
          loading: false,
          items: [],
        },
      ],
      RootComponent: () => null,
      engine: 'react',
    };
    reducerInstance.processModule(first);
    reducerInstance.processModule(second);
    const reducedData = reducerInstance.reduce([], { type: 'NOTHING_CASE' });

    const firstClickState = reducerInstance.reduce(reducedData, locationAction('/first'));

    expect(firstClickState.filter((x) => x.selected).length).toBe(1);

    const secondClickState = reducerInstance.reduce(firstClickState, locationAction('/second'));

    expect(secondClickState.filter((x) => x.selected).length).toBe(1);
  });
});
