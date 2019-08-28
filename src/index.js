// @flow

import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import {Router, Route, Switch} from 'react-router-dom'
import {Button} from 'antd'
import AppTitle from './components/AppTitle';
import core from './coreInstance';

const rootElement = document.getElementById('root')
if (rootElement) {
  ReactDOM.render(<App/>, rootElement)
}

class Test extends React.Component<null> {

  render() {
    return (
      <div>
        <AppTitle title="Root" />
        test namespace:
        <Router history={core.history}>
          <Switch>
            <Route
              path={'/test/test2'}
              component={() => (
                <div>
                  <AppTitle title="Test 2" />
                  <p>
                    <Button type={'primary'}>
                      status
                    </Button>
                  </p>
                  ыфаафыыаф
                </div>
              )}
            />
            <Route path={'/test/test'} component={() => <div><AppTitle title="Test" />1</div>}/>
            <Route path={'/'} component={() => <div>ЬЬЬ</div>}/>
          </Switch>
        </Router>
      </div>
    )
  }
}

core.register(
  'test',
  [
    { label: 'Cluster', path: '/test/test2' },
    {
      label: 'Dashboard',
      path: '/test/test',
      items: [
        { label: 'Subitem', path: '/test/test/test' },
        { label: 'Subitem 2', path: '/test/test/test2' },
      ],
    },
  ],
  Test,
  'react'
)

core.register(
  'space',
  [
    { label: 'Space Cluster', path: '/space/test2' },
    { label: 'Space Dashboard', path: '/space/test' },
  ],
  Test,
  'react'
)

core.setHeaderComponent(<div style={{position: 'absolute', right: 0, top: 0}}><span >Absolute</span></div>)
setTimeout(() => {
  core.setHeaderComponent(
    null
  )
}, 3000)
