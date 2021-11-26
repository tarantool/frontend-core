// @flow
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';

import { useCore } from '../context';
import type { State } from '../store';
import { selectRouteIsAllowed } from '../store/selectors';
import { useForceUpdate } from '../utils/hooks';
import NoComponent from './NoComponent';

type RoutesProps = {
  routeIsAllowed: boolean,
};

const Routes = ({ routeIsAllowed }: RoutesProps) => {
  const core = useCore();
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    if (!core) {
      return;
    }

    return core.subscribe('registerModule', forceUpdate);
  }, [core]);

  if (!core) {
    return null;
  }

  return (
    <ConnectedRouter history={core.history}>
      <Switch>
        {routeIsAllowed &&
          core
            .getModules()
            .map((module) => (
              <Route key={module.namespace} path={'/' + module.namespace} component={module.RootComponent} />
            ))}
        <Route path="/" component={NoComponent} />
      </Switch>
    </ConnectedRouter>
  );
};

export default connect((state: State) => {
  return {
    routeIsAllowed: selectRouteIsAllowed(state),
  };
})(Routes);
