import Routes from './Routes'
import { generateCoreWithStore } from '../test-utils/coreInstance'
import renderer from 'react-test-renderer'
import React from 'react'
import { Route, Router, Switch } from 'react-router-dom'
import testSvg from './Notification/success-circle.svg'
import { push } from 'connected-react-router'
import { Provider } from 'react-redux'

test('not found', () => {
  const { coreInstance, store } = generateCoreWithStore()

  class NotFound extends React.Component {
    render() {
      return <div className={'meta-not-found'}>Not found</div>
    }
  }

  class LocalTest extends React.Component<null> {
    render() {
      return (
        <div>
          <Router history={coreInstance.history}>
            <Switch>
              <Route path={'/mytest/test'} component={() => <div className={'meta-content'}>my test 1</div>} />
              <Route
                path={'/'}
                component={() => (
                  <div>
                    <NotFound />
                  </div>
                )}
              />
            </Switch>
          </Router>
        </div>
      )
    }
  }

  class LocalTestTwo extends React.Component<null> {
    render() {
      return (
        <div>
          <Router history={coreInstance.history}>
            <Switch>
              <Route path={'/other/test'} component={() => <div className={'meta-content'}>other test 2</div>} />
              <Route
                path={'/'}
                component={() => (
                  <div>
                    <NotFound />
                    <wbr />
                  </div>
                )}
              />
            </Switch>
          </Router>
        </div>
      )
    }
  }

  class RouteProvider extends React.Component {
    render(): React.ReactNode {
      const { store, core } = this.props
      return (
        <div>
          <Provider store={store}>
            <div>
              <Routes key={'routes'} core={core} />
            </div>
          </Provider>
        </div>
      )
    }
  }

  coreInstance.register(
    'mytest',
    [
      {
        label: 'My Test',
        path: '/mytest/test',
        icon: 'hdd'
      }
    ],
    LocalTest,
    'react'
  )

  coreInstance.register(
    'other',
    [
      {
        label: 'Other',
        path: '/other/test',
        icon: testSvg
      }
    ],
    LocalTestTwo,
    'react'
  )

  store.dispatch(push('/other/test'))
  const unregisterFilter = coreInstance.pageFilter.registerFilter(() => false)
  const component = renderer.create(<RouteProvider store={store} core={coreInstance} key={'prov'} />)

  expect(JSON.stringify(component.toJSON())).toContain('Not loaded')

  unregisterFilter()

  component.update(<RouteProvider store={store} core={coreInstance} key={'prov'} />)

  expect(JSON.stringify(component.toJSON())).toContain('other test 2')
  expect(component.root.findAllByType(NotFound)).toEqual([])

  store.dispatch(push('/mytest/test'))
  component.update(<RouteProvider store={store} core={coreInstance} key={'prov'} />)

  expect(JSON.stringify(component.toJSON())).toContain('my test 1')
  expect(component.root.findAllByType(NotFound)).toEqual([])
})
