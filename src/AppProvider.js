// @flow
import React, { Component } from 'react';
import { Provider } from 'react-redux';

import { CoreContext } from './context';
import type Core from './core';

type AppProps = {
  core: Core,
  children: any,
};

export default class AppProvider extends Component<AppProps> {
  render() {
    const { core, children } = this.props;
    return (
      <CoreContext.Provider value={core}>
        <Provider store={core.store}>{children}</Provider>
      </CoreContext.Provider>
    );
  }
}
