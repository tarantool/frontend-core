import { changeTitleMiddleware } from './title'
import { generateCoreWithStore } from '../../test-utils/coreInstance'
import { locationAction } from '../reducers/menu.test'

describe('Title middlware', () => {
  const fakeNext = () => { };
  const fakeStore = (title) => ({
    getState: () => ({
      appTitle: { title },
    })
  });

  it('should be set title', () => {
    changeTitleMiddleware(fakeStore('title'))(fakeNext)({ type: 'Nothing' })

    expect(document.title).toBe('title');
  })

  it('should be changed onClick', () => {
    const { coreInstance: newCore, store: newStore } = generateCoreWithStore()
    newCore.register(
      'test',
      [
        {
          label: 'one',
          path: '/one',
          selected: false,
          expanded: false,
          loading: false,
          items: []
        },
        {
          label: 'two',
          path: '/two',
          selected: false,
          expanded: false,
          loading: false,
          items: []
        }
      ],
      () => null,
      'react'
    )

    newStore.dispatch(locationAction('/one'))
    expect(document.title).toBe('one')

    newStore.dispatch(locationAction('/two'))
    expect(document.title).toBe('two')
  })
})
