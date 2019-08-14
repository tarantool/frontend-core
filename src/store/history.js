import { createBrowserHistory } from 'history';

export const APP_PATH_PREFIX = '/admin';
export default createBrowserHistory({ basename: `${APP_PATH_PREFIX}/` });
