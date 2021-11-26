// @flow
// $FlowFixMe
import './styles/reset';

import React, { Component } from 'react';
import { AppLayout } from '@tarantool.io/ui-kit';

import AppProvider from './AppProvider';
import FavIcon from './components/FavIcon';
import Header from './components/Header';
import Menu from './components/Menu';
import NotificationList from './components/NotificationList';
import Routes from './components/Routes';
import type Core from './core';

type AppProps = {
  core: Core,
};

export default class App extends Component<AppProps> {
  render() {
    const { core } = this.props;
    return (
      <AppProvider core={core}>
        <AppLayout className="meta-tarantool-app" sidebarComponent={Menu}>
          <FavIcon />
          <Header />
          <Routes />
          <NotificationList />
        </AppLayout>
      </AppProvider>
    );
  }
}
