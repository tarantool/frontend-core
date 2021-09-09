// @flow
import type { FSA } from '../../core';
import { disposableFunctionKey, disposeFnByKey } from '../../utils/disposableFnMap';
import { PAGE_FILTER_ADD, PAGE_FILTER_REMOVE } from '../constants';

const fnSubstituteAction = [PAGE_FILTER_ADD, PAGE_FILTER_REMOVE];

export default () => (next: Function) => (action: FSA) => {
  if (fnSubstituteAction.includes(action.type)) {
    // $FlowFixMe
    action.payload.fn = disposableFunctionKey(action.payload.fn);
    if (action.type === PAGE_FILTER_REMOVE) {
      disposeFnByKey(action.payload.fn);
    }
  }

  return next(action);
};
