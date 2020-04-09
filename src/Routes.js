// @flow

import React from 'react';
import { Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import NoComponent from './components/NoComponent'
import coreInstance from './coreInstance'
import type { State } from './store'
import { routeIsAllowed } from './store/selectors'

type RoutesProps = {
  routeIsAllowed: boolean,
}

const mapRoutesModule = () => {
  const modules = coreInstance.getModules()
  return modules.map(module => (
    <Route key={module.namespace} path={'/' + module.namespace} component={module.RootComponent} />
  ))
}

class Routes extends React.Component<RoutesProps> {
  componentDidMount() {
    coreInstance.subscribe('registerModule', () => {
      this.forceUpdate()
    })
  }

  render() {
    const { routeIsAllowed } = this.props;
    return (
      <Switch>
        {routeIsAllowed && mapRoutesModule()}
        <Route path={'/'} component={NoComponent} />
      </Switch>
    )
  }
}

export default connect((state: State) => {
  return {
    routeIsAllowed: routeIsAllowed(state)
  }
})(Routes)
