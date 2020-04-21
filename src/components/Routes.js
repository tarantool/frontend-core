// @flow

import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import NoComponent from './NoComponent'
import type { State } from '../store'
import { selectRouteIsAllowed } from '../store/selectors'
import { ConnectedRouter } from 'connected-react-router'
import Core from '../core'

type RoutesProps = {
  routeIsAllowed: boolean,
  core: Core
}

class Routes extends React.Component<RoutesProps> {
  componentDidMount() {
    this.props.core.subscribe('registerModule', () => {
      this.forceUpdate()
    })
  }

  render() {
    const { core } = this.props

    return (
      <ConnectedRouter history={core.history}>
        <Switch>
          <Route path={'/'} component={NoComponent} />
        </Switch>
      </ConnectedRouter>
    )
  }
}

export default connect((state: State, { core }) => {
  return {
    routeIsAllowed: selectRouteIsAllowed(state),
    core
  }
})(Routes)
