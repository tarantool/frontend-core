// @flow

import { ALLOW_ROUTE, DISABLE_ROUTE } from '../constants'
import type { FSA } from '../../core'

export type RoutesState = {
  isRouteAllowed: boolean
}

const initialState = {
  isRouteAllowed: false
}

export default (state: RoutesState = initialState, { type }: FSA): RoutesState => {
  switch (type) {
    case ALLOW_ROUTE: {
      return {
        ...state,
        isRouteAllowed: true
      }
    }
    case DISABLE_ROUTE: {
      return {
        ...state,
        isRouteAllowed: false
      }
    }
  }
  return state
}
