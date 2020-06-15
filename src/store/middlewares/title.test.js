import { changeTitleMiddleware } from './title'
import { generateCoreWithStore } from '../../test-utils/coreInstance'
import { locationAction, titleSetAction } from '../../test-utils/reduxActions'
import AppTitle from '../../components/AppTitle'
import { Route, Router, Switch } from 'react-router-dom'

describe('Title middlware', () => {
  const fakeNext = () => { };
  const fakeStore = (title) => ({
    getState: () => ({
      appTitle: { title }
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

  it('should be correct work with appTitle', () => {
    const { coreInstance: newCore, store: newStore } = generateCoreWithStore()

    const RootComponent = () => (
      <div>
        <AppTitle title={'AppTitle'} />
        <Router history={newCore.history}>
          <Switch>
            <Route path={'/test/one'} component={() => <div>1</div>} />
            <Route path={'/test/two'} component={() => <div>2</div>} />
            <Route path={'/'} component={() => <div>Not found</div>} />
          </Switch>
        </Router>
      </div>
    )
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
      RootComponent,
      'react'
    )

    newStore.dispatch(titleSetAction('AppTitle'))

    newStore.dispatch(locationAction('/one'))
    expect(document.title).toBe('AppTitle')

    newStore.dispatch(locationAction('/two'))
    expect(document.title).toBe('AppTitle')
  })
})
