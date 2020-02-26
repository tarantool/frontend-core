import { createBrowserHistory } from 'history'

if (!window.__tarantool_admin_prefix) {
  window.__tarantool_admin_prefix = ''
}

export const APP_PATH_PREFIX = window.__tarantool_admin_prefix + '/admin'
export default createBrowserHistory({ basename: `${APP_PATH_PREFIX}/` })
