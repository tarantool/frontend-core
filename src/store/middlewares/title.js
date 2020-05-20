// @flow
import { selectTitle } from '../selectors'
import { type FSA } from '../../core'

let cachedTitle = '';

export const changeTitleMiddleware = (store: Object) => (next: Function) => (action: FSA) => {
  const result = next(action)

  const title = selectTitle(store.getState());
  if (cachedTitle !== title) {
    cachedTitle = title;
    window.document.title = title;
  }

  return result
}
