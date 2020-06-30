// @flow
import { selectAppName, selectTitle } from '../selectors'
import { type FSA } from '../../core'

let cachedAppName = '';
let cachedTitle = '';

export const changeTitleMiddleware = (store: Object) => (next: Function) => (action: FSA) => {
  const result = next(action)

  const state = store.getState();
  const appName = selectAppName(state);
  const title = selectTitle(state);

  if (cachedAppName !== appName || cachedTitle !== title) {
    cachedAppName = appName;
    cachedTitle = title;
    window.document.title = appName ? `${appName}: ${title}` : title;
  }

  return result;
}
