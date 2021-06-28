// @flow

import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Router, Route, Switch } from 'react-router-dom'
import AppTitle from './components/AppTitle'
import core from './coreInstance'
import store from './store/index'
import { IconTrash, IconInfo, IconTask, IconEdit } from '@tarantool.io/ui-kit'

const rootElement = document.getElementById('root')
if (rootElement) {
  ReactDOM.render(<App store={store} core={core} />, rootElement)
}

const textElements = []

for (let i = 0; i < 100; i++) {
  textElements.push(
    <div style={{ marginBottom: '20px' }} key={i}>
      Test text overflow row: {i}
    </div>
  )
}

class Test extends React.Component<null> {
  render() {
    return (
      <div>
        <AppTitle title={'my test'} />
        <Router history={core.history}>
          <Switch>
            <Route path={'/mytest/test'} component={() => <div>1</div>} />
            <Route path={'/'} component={() => <div>Not found</div>} />
          </Switch>
        </Router>
      </div>
    )
  }
}

class TestTwo extends React.Component<null> {
  render() {
    return (
      <div>
        <AppTitle title={'TestTwo Root'} path='/other' />
        <Router history={core.history}>
          <Switch>
            <Route path='/other/test' component={() => <div>1</div>} />
            <Route path='/other/test2' component={() => <div>2</div>} />
            <Route path='/other/test3' component={() => <div>3</div>} />
            <Route
              path='/other/test4'
              exact
              render={() => (
                <div>
                  <AppTitle title='my test4' path='/other/test4' />
                  4
                </div>
              )}
            />
            <Route
              path='/other/test4/subtest1'
              render={() => (
                <div>
                  <AppTitle title='Subpage' propsList={[{ title: 'adasd', path: '/other/dasd' }]} />
                  4-1
                </div>
              )}
            />
            <Route path='/' component={() => <div>Not found</div>} />
          </Switch>
        </Router>
      </div>
    )
  }
}

core.register(
  'mytest',
  [
    {
      label: 'My Test',
      path: '/mytest/test',
      icon: 'hdd'
    }
  ],
  Test,
  'react'
)

core.register(
  'other',
  [
    {
      label: 'Other',
      path: '/other/test',
      icon: IconInfo
    },
    {
      label: 'This test',
      path: '/this/test',
      icon: IconTrash,
      items: [
        {
          label: 'Test1',
          path: '/this/test/1'
        },
        {
          label: 'Test2',
          path: '/this/test/2'
        }, {
          label: 'Test3',
          path: '/this/test/3'
        }
      ]
    },
    {
      label: 'that test2',
      path: '/that/test',
      icon: IconEdit,
      items: [
        {
          label: 'Test1',
          path: '/that/test/5'
        },
        {
          label: 'Test2',
          path: '/that/test/6'
        }, {
          label: 'Test3',
          path: '/that/test/7'
        }
      ]
    },
    {
      label: 'Other2',
      path: '/other/test2',
      icon: IconTask
    },
    {
      label: 'Other3',
      path: '/other/test3',
      icon: 'hdd'
    },
    {
      icon: IconInfo,
      label: 'Documentation',
      path: 'https://www.tarantool.io/en/doc',
      type: 'external',
      pinBottom: true
    }
  ],
  TestTwo,
  'react'
)

setTimeout(
  () => core.notify({
    type: 'success',
    title: 'Hello',
    message: `Create the replicaset "Name of replicaset #5"
  to with server "pim.dmitrov_ storages_ msk_eapi_trn57_5" executed successfully`
  }),
  2000
)

setTimeout(
  () => core.notify({
    type: 'error',
    title: 'Привет',
    message: 'GraphQL error: "localhost:3303": Connection refused',
    details: 'NetboxError: GraphQL error: "localhost:3303": Connection refused\n\n' +
      '```\nstack traceback:\n\t' +
      '.../cartridge/cartridge/pool.lua:125: in function \'connect\'\n\t' +
      '.../cartridge/cartridge/pool.lua:144: in function ' +
      '<.../cartridge/cartridge/pool.lua:142>\n```'
  }),
  4000
);

setTimeout(
  () => core.notify({
    type: 'success',
    title: 'hello',
    message: 'Тут что-то интересное произошло'
  }),
  7000
)

for (let i = 0; i < 5; i++) {
  core.notify({
    type: 'success',
    title: 'hello',
    message: `Create the replicaset "Name of replicaset #2" 
  to with server "pim.dmitrov_ storages_ msk_eapi_trn57_5" executed successfully`
  })
}

core.dispatch('setAppName', 'Frontend Core')

setTimeout(() => {
  core.setHeaderComponent(null)
}, 3000)

const unregisterFilter = core.pageFilter.registerFilter(() => false)

setTimeout(() => {
  unregisterFilter()
}, 1000)
