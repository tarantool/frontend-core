// @flow

import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Router, Route, Switch } from 'react-router-dom'
import AppTitle from './components/AppTitle'
import core from './coreInstance'
import testSvg from './components/Notification/success-circle.svg'

const rootElement = document.getElementById('root')
if (rootElement) {
  ReactDOM.render(<App />, rootElement)
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
  render () {
    return (
      <div>
        <AppTitle title="Root" link={'/test/test2'} />
        Tarantool - Frontend Core
        <Router history={core.history}>
          <Switch>
            <Route
              path={'/test/test'}
              component={() => (
                <div>
                  <AppTitle title="Test 2" />
                  <AppTitle title="Test 3" />
                  <AppTitle title="Test 4" />
                  <AppTitle title="Test 6" />
                  <p>Test title page</p>
                </div>
              )}
            />
            <Route
              path={'/test/sub'}
              component={() => (
                <div>
                  <AppTitle title="Test" />
                  {textElements}
                </div>
              )}
            />
            <Route path={'/test/icon'} component={() => <div>Just content</div>} />
            <Route path={'/'} component={() => <div>Some root</div>} />
          </Switch>
        </Router>
      </div>
    )
  }
}

core.register(
  'test',
  [
    {
      label: 'Simple Title Example',
      path: '/test/test',
      icon: 'hdd'
    },
    {
      label: 'SubItems Example',
      path: '/test/sub',
      items: textElements.map((r, i) => ({ label: `Subitem ${i}`, path: `/test/sub/${i}` }))
    },
    {
      label: 'Test custom icon',
      path: '/test/icon/1'
    },
    {
      label: 'Съешь же',
      path: '/test/icon/2',
      icon: <img src={testSvg} style={{ width: 14, height: 14 }} />
    },
    {
      label: <b>ещё этих</b>,
      path: '/test/icon/3',
      icon: 'hdd'
    },
    {
      label: <i>мягких французских</i>,
      path: '/test/icon/4',
      icon: 'hdd'
    },
    {
      label: <b><i>булок, да выпей чаю</i></b>,
      path: '/test/icon/5'
    }
  ],
  Test,
  'react'
)

core.notify({
  type: 'success',
  title: 'Hello',
  message: `Create the replicaset <b>"Name of replicaset #2"</b>
 to with server "pim.dmitrov_ storages_ msk_eapi_trn57_5" executed successfully`
})
core.notify({
  type: 'error',
  title: 'Привет',
  message: `Create the replicaset "Name of replicaset #2"
   to with server "pim.dmitrov_ storages_ msk_eapi_trn57_5" executed successfully`
})
core.notify({
  type: 'default',
  title: 'hello',
  message: `Тут что-то интересное произошло`
})
core.notify({
  type: 'success',
  title: 'hello',
  message: `Create the replicaset "Name of replicaset #2" 
  to with server "pim.dmitrov_ storages_ msk_eapi_trn57_5" executed successfully`
})
setTimeout(() => {
  core.setHeaderComponent(null)
}, 3000)
