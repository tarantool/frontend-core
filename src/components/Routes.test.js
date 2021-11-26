/* eslint-disable sonarjs/no-duplicate-string */
import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import renderer from 'react-test-renderer';
import { push } from 'connected-react-router';

import AppProvider from '../AppProvider';
import Core from '../core';
import testSvg from './Notification/success-circle.svg';
import Routes from './Routes';

test('not found', () => {
  const core = new Core();

  class NotFound extends React.Component {
    render() {
      return <div className="meta-not-found">Not found</div>;
    }
  }

  class LocalTestOne extends React.Component<null> {
    render() {
      return (
        <Router history={core.history}>
          <Switch>
            <Route path="/mytest/test" component={() => <div className="meta-content">my test 1</div>} />
            <Route path="/" component={() => <NotFound />} />
          </Switch>
        </Router>
      );
    }
  }

  class LocalTestTwo extends React.Component<null> {
    render() {
      return (
        <Router history={core.history}>
          <Switch>
            <Route path="/other/test" component={() => <div className="meta-content">other test 2</div>} />
            <Route
              path="/"
              component={() => (
                <div>
                  <NotFound />
                  <wbr />
                </div>
              )}
            />
          </Switch>
        </Router>
      );
    }
  }

  class RouteProvider extends React.Component {
    render() {
      const { core } = this.props;
      return (
        <AppProvider core={core}>
          <Routes />
        </AppProvider>
      );
    }
  }

  core.registerModule({
    namespace: 'mytest',
    menu: [
      {
        label: 'My Test',
        path: '/mytest/test',
        icon: 'hdd',
      },
    ],
    RootComponent: LocalTestOne,
  });

  core.registerModule({
    namespace: 'other',
    menu: [
      {
        label: 'Other',
        path: '/other/test',
        icon: testSvg,
      },
    ],
    RootComponent: LocalTestTwo,
  });

  core.store.dispatch(push('/other/test'));
  const unregisterFilter = core.pageFilter.registerFilter(() => false);
  const component = renderer.create(<RouteProvider core={core} />);

  expect(JSON.stringify(component.toJSON())).toContain('Not loaded');

  unregisterFilter();

  component.update(<RouteProvider core={core} />);

  expect(JSON.stringify(component.toJSON())).toContain('other test 2');
  expect(component.root.findAllByType(NotFound)).toEqual([]);

  core.store.dispatch(push('/mytest/test'));
  component.update(<RouteProvider core={core} />);

  expect(JSON.stringify(component.toJSON())).toContain('my test 1');
  expect(component.root.findAllByType(NotFound)).toEqual([]);
});
