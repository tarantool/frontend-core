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
      if (action.payload && action.payload.fn) return state.concat(action.payload.fn)
      else return state
    }
    case PAGE_FILTER_REMOVE: {
      if (action.payload && action.payload.fn) {
        const fn = action.payload.fn
        return state.filter(x => x !== fn)
      } else return state
    }
    default: {
      return state
    }
  }
}
