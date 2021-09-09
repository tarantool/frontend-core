import React from 'react';

import { generateCoreWithStore } from '../../test-utils/coreInstance';
import { selectMenu } from '../selectors';

class Test extends React.Component {
  render() {
    return <div></div>;
  }
}

describe('page filter', () => {
  it('filter out page', () => {
    const { coreInstance: newCore, store: newStore } = generateCoreWithStore();

    newCore.register(
      'test',
      [
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
      Test,
      'react',
      null
    );

    const unsubFilter = newCore.pageFilter.registerFilter(({ path }) => !path.includes('/test/icon/6'));

    unsubFilter();

    const fullMenu = selectMenu(newStore.getState());

    expect(fullMenu).toHaveLength(2);
  });
});
