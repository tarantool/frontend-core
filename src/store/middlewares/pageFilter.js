import type { FSA } from '../../core'
import { PAGE_FILTER_ADD, PAGE_FILTER_REMOVE } from '../constants'
import { disposableFunctionKey, disposeFnByKey } from '../../utils/disposableFnMap'

const fnSubstituteAction = [PAGE_FILTER_ADD, PAGE_FILTER_REMOVE]

export default () => (next: Function) => (action: FSA) => {
  if (fnSubstituteAction.includes(action.type)) {
    action.payload.fn = disposableFunctionKey(action.payload.fn)
    if (action.type === PAGE_FILTER_REMOVE) {
      disposeFnByKey(action.payload.fn)
    }
  }

  return next(action)
}
