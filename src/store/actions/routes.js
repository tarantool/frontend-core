import { ALLOW_ROUTE, DISABLE_ROUTE } from '../constants'

export type AllowRouteAction = {
  type: typeof ALLOW_ROUTE,
  payload: {}
}

export type DisableRouteAction = {
  type: typeof DISABLE_ROUTE,
  payload: {}
}

export const allowRoute = (): AllowRouteAction => ({
  type: ALLOW_ROUTE,
  payload: {}
})

export const disableRoute = (): DisableRouteAction => ({
  type: DISABLE_ROUTE,
  payload: {}
})
