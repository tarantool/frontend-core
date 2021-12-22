// @flow
import React from 'react';

import AppContent from './AppContent';
import AppProvider from './AppProvider';
import type Core from './core';

type AppProps = {
  core: Core,
};

const App = ({ core }: AppProps) => {
  return (
    <AppProvider core={core}>
      <AppContent />
    </AppProvider>
  );
};

export default App;
