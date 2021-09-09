import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import * as R from 'ramda';
import { combineReducers, createStore } from 'redux';

import { disposableFunctionKey } from '../utils/disposableFnMap';
import Header from './Header';

describe('Header component', () => {
  const initialState = {
    menu: [
      {
        selected: true,
        expanded: false,
        loading: false,
        items: [],
        label: 'Cluster',
        path: '/test/test2',
        namespace: 'test',
      },
      {
        selected: false,
        expanded: false,
        loading: false,
        items: [],
        label: 'Dashboard',
        path: '/test/test',
        namespace: 'test',
      },
    ],
    appTitle: {
      appName: null,
      title: '',
      propsList: [],
    },
    notifications: {
      active: [],
      archive: [],
    },
    ui: {
      showNotificationList: false,
    },
    pageFilter: [disposableFunctionKey(R.T)],
  };

  const initialStateWithTitle = {
    ...initialState,
    appTitle: {
      ...initialState.appTitle,
      appName: 'App Name',
      title: 'App Title',
      propsList: [{ title: 'App Title' }],
    },
  };

  it('use current menu item label, if appTitle is empty', () => {
    const mockStore = createStore(
      combineReducers({
        menu: (state = initialState.menu) => state,
        appTitle: (state = initialState.appTitle) => state,
        notifications: (state = initialState.notifications) => state,
        ui: (state = initialState.ui) => state,
        pageFilter: (state = initialState.pageFilter) => state,
      })
    );

    const component = renderer.create(
      <Provider store={mockStore}>
        <Header />
      </Provider>
    );

    expect(component.root.findAllByType('span').map((el) => el.children)).toEqual([['/'], ['Cluster']]);
    expect(component.root.findAllByType('span')[1].children[0]).toEqual('Cluster');
  });

  it('display appTitle.title and appName', () => {
    const mockStore = createStore(
      combineReducers({
        menu: (state = initialStateWithTitle.menu) => state,
        appTitle: (state = initialStateWithTitle.appTitle) => state,
        notifications: (state = initialState.notifications) => state,
        ui: (state = initialState.ui) => state,
        pageFilter: (state = initialState.pageFilter) => state,
      })
    );

    const component = renderer.create(
      <Provider store={mockStore}>
        <Header />
      </Provider>
    );

    expect(component.root.findAllByType('span')[0].children[0]).toEqual('App Name');
  });
});
