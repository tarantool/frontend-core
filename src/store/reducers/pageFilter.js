// @flow

import type { FSA } from '../../core'

const initialState: Array<String> = []

export default (state: Array<string>, action: FSA) => {
  switch (action.type) {
    case 'ADD_FILTER': {
      return state.concat(action.payload.fn)
    }
    case 'REMOVE_FILTER': {
      return state.filter(x => x !== action.payload.fn)
    }
    default: {
      return state
    }
  }
}
