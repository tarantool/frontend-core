// @flow

import type { FSA } from '../../core'
import { disposableFunctionKey } from '../../utils/disposableFnMap'
import * as R from 'ramda'
import { PAGE_FILTER_ADD, PAGE_FILTER_REMOVE } from '../constants'

export type PageFilterState = Array<string>

export const initialState: PageFilterState = [disposableFunctionKey(R.T)]

export default (state: PageFilterState = initialState, action: FSA): PageFilterState => {
  switch (action.type) {
    case PAGE_FILTER_ADD: {
      return state.concat(action.payload.fn)
    }
    case PAGE_FILTER_REMOVE: {
      return state.filter(x => x !== action.payload.fn)
    }
    default: {
      return state
    }
  }
}
