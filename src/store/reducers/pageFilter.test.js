import React from 'react';

import Core from '../../core';
import { selectMenu } from '../selectors';

class Test extends React.Component {
  render() {
    return <div></div>;
  }
}

describe('page filter', () => {
  it('filter out page', () => {
    const core = new Core();
    core.registerModule({
      namespace: 'test',
      menu: [
        {
          label: 'Simple Title Example',
          path: '/test/test',
          icon: 'hdd',
        },
        {
          label: 'Меня не видно',
          path: '/test/icon/6',
        },
      ],
      RootComponent: Test,
    });

    const unsubFilter = core.pageFilter.registerFilter(({ path }) => !path.includes('/test/icon/6'));

    unsubFilter();

    const fullMenu = selectMenu(core.store.getState());

    expect(fullMenu).toHaveLength(2);
  });
});
