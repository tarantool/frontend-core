import Core from '../../core'
import { createCoreStore } from '../index'
import testSvg from '../../components/Notification/success-circle.svg'
import React from 'react'
import { selectMenu } from '../selectors'
import { generateCoreWithStore } from '../../test-utils/coreInstance'



class Test extends React.Component{
  render() {
    return <div></div>
  }
}

describe('page filter', () => {
  it('filter out pages', () => {
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

    console.log(menu)

    expect(menu).toHaveLength(1)
  })
})
