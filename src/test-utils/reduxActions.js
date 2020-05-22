import * as constants from '../store/constants'

export const locationAction = pathname => ({
  type: constants.LOCATION_CHANGE,
  payload: {
    location: {
      pathname
    }
  }
})

export const titleSetAction = title => ({
  type: constants.TITLE_SET,
  payload: {
    title
  }
})
