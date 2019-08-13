Side navigation menu component to use in frontend-core

```
import { BrowserRouter as Router } from 'react-router-dom';

state = [
  {
    label: 'Vegetables',
    path: '/vegs',
    selected: true,
    expanded: false
  },
  {
    label: 'Fruits',
    path: '/fruits',
    selected: false,
    expanded: false,
    items: [
      {
        label: 'Fruits Banana',
        path: '/fruits/banana',
        selected: false
      },
      {
        label: 'Apple',
        path: '/fruits/apple',
        selected: false
      }
    ]
  },
  {
    label: 'Space missions',
    path: '/space-missions',
    selected: true,
    expanded: true,
    items: [
      {
        label: 'Apollo',
        path: '/space-missions/apollo',
        selected: false
      },
      {
        label: 'Soyuz',
        path: '/space-missions/soyuz',
        selected: false
      },
      {
        label: 'Shuttle',
        path: '/space-missions/shuttle',
        selected: false
      }
    ]
  },
  {
    label: 'Gems',
    path: '/gems',
    selected: false,
    expanded: false,
    items: []
  }
];

const bottomLinks = [
  {
    icon: 'fdsfd',
    label: 'Documentation',
    path: 'https://mail.ru'
  },
  {
    icon: 'fwokm',
    label: 'Support',
    path: 'https://google.ru'
  }
];

<Router>
  <NavMenu
    bottomLinks={bottomLinks}
    items={state}
  />

  <NavMenu
    bottomLinks={bottomLinks}
    collapsed={true}
    items={state}
  />
</Router>
```