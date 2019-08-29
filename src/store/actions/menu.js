import { EXPAND } from '../constants'

export const expand = link => ({
  type: EXPAND,
  payload: {
    location: {
      pathname: link
    }
  }
})
