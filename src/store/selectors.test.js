import { flattenMenu, selectCurrentMenuItemLabel } from './selectors'

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
        items: [],
      },
    ],
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
          items: [],
        },
      ],
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
    {
      label: 'Cabbage',
      path: '/vegs/cabbage',
      selected: false,
      expanded: false,
      loading: false,
      items: [],
    },
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
  ];

  const flattenedMenu = flattenMenu(initialMenu);
  expect(flattenedMenu).toEqual(expectedResult);
});

test('selectCurrentMenuItemLabel', () => {
  const label = selectCurrentMenuItemLabel({ menu: initialMenu });
  expect(label).toBe('Vegetables');
});

test('selectCurrentMenuItemLabel when anyone menu item isn\'t selected', () => {
  const label = selectCurrentMenuItemLabel({
    menu: [
      {
        label: 'Fruits Banana',
        path: '/fruits/banana',
        selected: false,
        expanded: false,
        loading: false,
        items: [],
      },
    ],
  });

  expect(label).toBe('');
  expect(selectCurrentMenuItemLabel({ menu: [] })).toBe('');
});
