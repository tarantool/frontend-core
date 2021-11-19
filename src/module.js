// we use webpack's dynamic public path feature to set path prefix from backend
import './publicPath';

import React from 'react';
import ReactDOM from 'react-dom';

import analyticModule from './analytics';
import apiMethods from './api';
import App from './App';
import AppTitle from './components/AppTitle';
import core from './coreInstance';
import store from './store';

core.components = {
  AppTitle,
};

core.logo = require('./assets/tarantool-logo-full.svg');

core.apiMethods = apiMethods;
core.analyticModule = analyticModule;

core.install = () => {
  ReactDOM.render(<App store={store} core={core} />, document.getElementById('root'));
};

// global export
if (typeof window !== 'undefined') {
  window.tarantool_enterprise_core = core;
  window.react = React;
  window.reactDom = ReactDOM;
}

export default core;
