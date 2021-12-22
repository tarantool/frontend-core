// @flow
// $FlowFixMe
import './styles/reset';

import React from 'react';
import { AppLayout } from '@tarantool.io/ui-kit';

import FavIcon from './components/FavIcon';
import Header from './components/Header';
import Menu from './components/Menu';
import NotificationList from './components/NotificationList';
import Routes from './components/Routes';
import { useAppReactTreeKey } from './context';

const AppContent = () => {
  const key = useAppReactTreeKey();

  return (
    <AppLayout key={`AppLayout-${key}`} className={`meta-tarantool-app tree-key-${key}`} sidebarComponent={Menu}>
      <FavIcon />
      <Header />
      <Routes />
      <NotificationList />
    </AppLayout>
  );
};

export default AppContent;
