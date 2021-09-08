// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';

import Core from '../core';
import type { State } from '../store';
import { selectRouteIsAllowed } from '../store/selectors';
import NoComponent from './NoComponent';

type RoutesProps = {
  routeIsAllowed: boolean,
  core: Core,
};

class Routes extends React.Component<RoutesProps> {
  mapRoutesModule() {
    const modules = this.props.core.getModules();
    return modules.map((module) => (
      <Route key={module.namespace} path={'/' + module.namespace} component={module.RootComponent} />
    ));
  }

  componentDidMount() {
    this.props.core.subscribe('registerModule', () => {
      this.forceUpdate();
    });
  }

  render() {
    const { routeIsAllowed, core } = this.props;
    return (
      <ConnectedRouter history={core.history}>
        <Switch>
          {routeIsAllowed && this.mapRoutesModule()}
          <Route path={'/'} component={NoComponent} />
        </Switch>
      </ConnectedRouter>
    );
  }
}

export default connect((state: State, { core }) => {
  return {
    routeIsAllowed: selectRouteIsAllowed(state),
    core,
  };
})(Routes);
