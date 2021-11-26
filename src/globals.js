import React from 'react';
import ReactDOM from 'react-dom';
import * as uiKit from '@tarantool.io/ui-kit';

import * as instance from './instance';

if (typeof window !== 'undefined') {
  window.tarantool_enterprise_core = instance.core;
  window.tarantool_frontend_core_module = instance;
  window.tarantool_frontend_ui_kit_module = uiKit;
  window.react = React;
  window.reactDom = ReactDOM;
}
