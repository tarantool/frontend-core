import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';

import AppTitle from '../../components/AppTitle';
import Core from '../../core';
import { setAppName, setTitle } from '../../store/actions/title';
import { locationAction } from '../../test-utils/reduxActions';
import { changeTitleMiddleware } from './title';

describe('Title middleware', () => {
  const fakeNext = () => void 0;
  const fakeStore = (appName, title) => ({
    getState: () => ({
      appTitle: { appName, title },
    }),
  });

  it('should be set title', () => {
    changeTitleMiddleware(fakeStore('appName', 'title'))(fakeNext)({ type: 'Nothing' });

    expect(document.title).toBe('appName: title');
  });

  it('should be changed onClick', () => {
    const core = new Core();
    core.registerModule({
      namespace: 'test',
      menu: [
        {
          label: 'one',
          path: '/one',
          selected: false,
          expanded: false,
          loading: false,
          items: [],
        },
        {
          label: 'two',
          path: '/two',
          selected: false,
          expanded: false,
          loading: false,
          items: [],
        },
      ],
      RootComponent: () => null,
    });

    core.store.dispatch(setAppName('SampleApp'));
    core.store.dispatch(locationAction('/one'));
    expect(document.title).toBe('SampleApp: one');
    core.store.dispatch(locationAction('/two'));
    expect(document.title).toBe('SampleApp: two');
  });

  it('should be correct work with appTitle', () => {
    const core = new Core();
    const RootComponent = () => (
      <div>
        <AppTitle title="AppTitle" />
        <Router history={core.history}>
          <Switch>
            <Route path="/test/one" component={() => <div>1</div>} />
            <Route path="/test/two" component={() => <div>2</div>} />
            <Route path="/" component={() => <div>Not found</div>} />
          </Switch>
        </Router>
      </div>
    );
    core.registerModule({
      namespace: 'test',
      menu: [
        {
          label: 'one',
          path: '/one',
          selected: false,
          expanded: false,
          loading: false,
          items: [],
        },
        {
          label: 'two',
          path: '/two',
          selected: false,
          expanded: false,
          loading: false,
          items: [],
        },
      ],
      RootComponent,
    });

    core.store.dispatch(setAppName('SampleApp'));
    core.store.dispatch(setTitle({ title: 'AppTitle' }));

    core.store.dispatch(locationAction('/one'));
    expect(document.title).toBe('SampleApp: AppTitle');

    core.store.dispatch(locationAction('/two'));
    expect(document.title).toBe('SampleApp: AppTitle');
  });
});
