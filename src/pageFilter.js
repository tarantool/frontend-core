import * as R from 'ramda'

export const generateFilterApi = core => {
  const filters = []


  const getFilters = () => filters
  const applyFilters = pages => R.filter(R.compose(filters))(pages)
  const filterPage = page => R.compose(filters)(page)

  const registerFilter = filter => {
    filters.push(filter)
    // dispatch always should be after mutation
    core.dispatch('core:pageFilter:apply', getFilters())
    return () => {
      filters.splice(filter.findIndex(x => x === filter), 1)
      // dispatch always should be after mutation
      core.dispatch('core:pageFilter:apply', getFilters())
    }
  }

  return {
    registerFilter,
    getFilters,
    applyFilters,
    filterPage,
  }
}

export default generateFilterApi
