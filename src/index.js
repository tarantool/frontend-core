import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import {Router, Route, Switch} from 'react-router-dom'


const core = window.tarantool_enterprise_core
ReactDOM.render(<App />, document.getElementById('root'))

class Test extends React.Component{

  render() {
    return (
      <div>
        test namespace:
        <Router history={core.history}>
          <Switch>
            <Route path={'/test/test2'}  component={() => <div>2</div>}/>
            <Route path={'/test/test'} component={() => <div>1</div>}/>
            <Route path={'/'} component={() => <div>ЬЬЬ</div>}/>
          </Switch>
        </Router>
      </div>
    )
  }

}

// setTimeout(() => {
  core.register('test', [
    {
      label: 'test',
      path: '/test/test',
    },
    {
      label: 'test2',
      path: '/test/test2',
    },
  ], Test, 'react')

  core.register('megatest', [
    {
      label: 'megatest 1',
      path: '/megatest/test',
    },
    {
      label: 'test2 23',
      path: '/megatest/test2',
    },
  ], Test, 'react')
// }, 1000)
