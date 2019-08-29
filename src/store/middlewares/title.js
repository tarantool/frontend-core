// @flow
import { TITLE_SET, TITLE_RESET } from '../constants'
import { selectTitle } from '../selectors'
import { type FSA } from '../../core'

export const changeTitleMiddleware = (store: Object) => (next: Function) => (action: FSA) => {
  const result = next(action)

  if (action.type === TITLE_SET || action.type === TITLE_RESET) {
    window.document.title = selectTitle(store.getState())
  }

  return result
}
