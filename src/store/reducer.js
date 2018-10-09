// @flow
import R from 'ramda'
import * as constants from './constants'

const initialState = []

const subReducers = []
const initedReducers = []

const defaultReducer = (state = initialState, action) => {

}

export default {
  reduce(state = initialState, action) {
    let finalState = []
    for (const subReducer of subReducers) {
      const subState = subReducer.reduce(subReducer.state, action)
      subReducer.state = subState
      finalState = [...state, ...subState]
    }
    return finalState
  },
  addUnusedReducer(menuReducer) {
    if (initedReducers.indexOf(menuReducer) >= 0)
      return;
    initedReducers.push(menuReducer)
    if (Array.isArray(menuReducer)) {
      subReducers.push({
        state: menuReducer,
        reducer: defaultReducer
      })
    } else {
      subReducers.push(({
        state: initialState,
        reducer: menuReducer
      }))
    }
  }
}
