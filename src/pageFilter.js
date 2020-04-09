import * as R from 'ramda'
import { PAGE_FILTER_ADD, PAGE_FILTER_REMOVE } from './store/constants'

export const generateFilterApi = core => {
  const filters = [R.T]

  const getFilters = () => filters
  const applyFilters = pages => R.filter(R.allPass(filters))(pages)
  const filterPage = page => R.allPass(filters)(page)

  const registerFilter = filter => {
    filters.push(filter)
    // dispatch always should be after mutation
    core.dispatch('core:pageFilter:apply', getFilters())
    core.dispatch('dispatchToken', {
      type: PAGE_FILTER_ADD,
      payload: {
        fn: filter
      }
    })
    core.dispatch('core:pageFilter:applied', getFilters())
    return () => {
      filters.splice(filter.findIndex(x => x === filter), 1)
      core.dispatch('core:pageFilter:apply', getFilters())
      core.dispatch('dispatchToken', {
        type: PAGE_FILTER_REMOVE,
        payload: {
          fn: filter
        }
      })
      core.dispatch('core:pageFilter:applied', getFilters())
      // dispatch always should be after mutation
    }
  }

  return {
    registerFilter,
    getFilters,
    applyFilters,
    filterPage
  }
}

export default generateFilterApi
