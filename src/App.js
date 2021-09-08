// @flow
// $FlowFixMe
import './styles/reset';

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { AppLayout } from '@tarantool.io/ui-kit';

import FavIcon from './components/FavIcon';
import Header from './components/Header';
import Menu from './components/Menu';
import NotificationList from './components/NotificationList';
import Routes from './components/Routes';
import Core from './core';

type AppProps = {
  store: Object,
  core: Core,
};

export default class App extends Component<AppProps> {
  render() {
    const { store, core } = this.props;
    return (
      <Provider store={store}>
        <AppLayout className="meta-tarantool-app" sidebarComponent={Menu}>
          <FavIcon />
          <Header />
          <Routes core={core} />
          <NotificationList />
        </AppLayout>
      </Provider>
    );
  }
}
