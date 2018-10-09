import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import history from './store/history'
import store from './store'
import './styles/reset'
import coreInstance from './coreInstance'
import Layout from './components/Layout'

const mapRoutesModule = () => {
  const modules = coreInstance.getModules()
  return modules.map(module => <Route path={module.namespace} component={module.RootComponent}/>)
}

class App extends Component {
  componentDidMount() {
    coreInstance.subscribe(() => {
      this.forceUpdate()
    })
  }
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Layout>
            <Switch>
              {mapRoutesModule()}
            </Switch>
          </Layout>
        </ConnectedRouter>
      </Provider>
    )
  }
}

export default App
