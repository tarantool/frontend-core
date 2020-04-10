import { flattenMenu, selectCurrentMenuItemLabel, selectRouteIsAllowed } from './selectors'
import { initialState as pageFilterInitialState } from './reducers/pageFilter'
import { disposableFunctionKey } from '../utils/disposableFnMap'
import * as R from 'ramda';

const initialMenu = [
  {
    label: 'Vegetables',
    path: '/vegs',
    selected: true,
    expanded: false,
    loading: false,
    items: [
      {
        label: 'Cabbage',
        path: '/vegs/cabbage',
        selected: false,
        expanded: false,
        loading: false,
        items: []
      }
    ]
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
        items: []
      },
      {
        label: 'Apple',
        path: '/fruits/apple',
        selected: false,
        expanded: false,
        loading: false,
        items: []
      }
    ]
  },
  {
    label: 'Gems',
    path: '/gems',
    selected: false,
    expanded: false,
    loading: false,
    items: []
  }
]

test('flattenMenu', () => {
  const expectedResult = [
    {
      label: 'Vegetables',
      path: '/vegs',
      selected: true,
      expanded: false,
      loading: false,
      items: [
        {
          label: 'Cabbage',
          path: '/vegs/cabbage',
          selected: false,
          expanded: false,
          loading: false,
          items: []
        }
      ]
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
          items: []
        },
        {
          label: 'Apple',
          path: '/fruits/apple',
          selected: false,
          expanded: false,
          loading: false,
          items: []
        }
      ]
    },
    {
      label: 'Gems',
      path: '/gems',
      selected: false,
      expanded: false,
      loading: false,
      items: []
    },
    {
      label: 'Cabbage',
      path: '/vegs/cabbage',
      selected: false,
      expanded: false,
      loading: false,
      items: []
    },
    {
      label: 'Fruits Banana',
      path: '/fruits/banana',
      selected: false,
      expanded: false,
      loading: false,
      items: []
    },
    {
      label: 'Apple',
      path: '/fruits/apple',
      selected: false,
      expanded: false,
      loading: false,
      items: []
    }
  ]

  const flattenedMenu = flattenMenu(initialMenu)
  expect(flattenedMenu).toEqual(expectedResult)
})

test('selectCurrentMenuItemLabel', () => {
  const label = selectCurrentMenuItemLabel({ menu: initialMenu, pageFilter: pageFilterInitialState })
  expect(label).toBe('Vegetables')
})

test("selectCurrentMenuItemLabel when anyone menu item isn't selected", () => {
  const label = selectCurrentMenuItemLabel({
    menu: [
      {
        label: 'Fruits Banana',
        path: '/fruits/banana',
        selected: false,
        expanded: false,
        loading: false,
        items: []
      }
    ],
    pageFilter: pageFilterInitialState
  })

  expect(label).toBe('')
  expect(selectCurrentMenuItemLabel({ menu: [], pageFilter: pageFilterInitialState })).toBe('')
})

test('check routeIsAllowed when menu includes pathname', () => {
  const state = {
    menu: [
      {
        label: 'Fruits Banana',
        path: '/fruits/banana',
        selected: false,
        expanded: false,
        loading: false,
        items: []
      }
    ],
    pageFilter: pageFilterInitialState,
    router: {
      location: {
        pathname: '/fruits/banana'
      }
    }
  };

  expect(selectRouteIsAllowed(state)).toBe(true);
})

test('check routeIsAllowed when menu not includes pathname', () => {
  const state = {
    menu: [
      {
        label: 'Fruits Banana',
        path: '/fruits/banana',
        selected: false,
        expanded: false,
        loading: false,
        items: []
      }
    ],
    pageFilter: [disposableFunctionKey(R.F)],
    router: {
      location: {
        pathname: '/tomato'
      }
    }
  };

  expect(selectRouteIsAllowed(state)).toBe(false);
})
