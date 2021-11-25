import { createBrowserHistory } from 'history';

if (typeof window !== 'undefined' && !window.__tarantool_admin_prefix) {
  window.__tarantool_admin_prefix = '';
}

export const APP_PATH_PREFIX = (typeof window !== 'undefined' ? window.__tarantool_admin_prefix : '') + '/admin';

export const createHistory = () => createBrowserHistory({ basename: `${APP_PATH_PREFIX}/` });
