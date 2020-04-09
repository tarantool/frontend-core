import React from 'react'
import { selectMenu } from '../selectors'
import { generateCoreWithStore } from '../../test-utils/coreInstance'

class Test extends React.Component {
  render() {
    return <div></div>
  }
}

describe('page filter', () => {
  it('filter out page support previous API', () => {
    const { coreInstance, store } = generateCoreWithStore()
    coreInstance.register(
      'test',
      [
        {
          label: 'Simple Title Example',
          path: '/test/test',
          icon: 'hdd'
        },
        {
          label: 'Меня не видно',
          path: '/test/icon/6'
        }
      ],
      Test,
      'react',
      null,
      ({ path }) => !path.includes('/test/icon/6')
    )

    const menu = selectMenu(store.getState())

    const { pageFilter } = store.getState()

    expect(menu).toHaveLength(1)
    expect(pageFilter).toHaveLength(2)

    const { coreInstance: newCore, store: newStore } = generateCoreWithStore()

    newCore.register(
      'test',
      [
        {
          label: 'Simple Title Example',
          path: '/test/test',
          icon: 'hdd'
        },
        {
          label: 'Меня не видно',
          path: '/test/icon/6'
        }
      ],
      Test,
      'react',
      null
    )

    const unsubFilter = newCore.pageFilter.registerFilter(({ path }) => !path.includes('/test/icon/6'))

    const newMenu = selectMenu(newStore.getState())

    expect(menu).toStrictEqual(newMenu)

    unsubFilter()

    const fullMenu = selectMenu(newStore.getState())

    expect(fullMenu).toHaveLength(2)
  })
})
