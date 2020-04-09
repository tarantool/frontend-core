// @flow

import * as R from 'ramda'
import { PAGE_FILTER_ADD, PAGE_FILTER_REMOVE } from './store/constants'
import Core from './core'
import type { MenuItemType } from './core'

export type PageFilterType = {
  registerFilter: Function => Function,
  getFilters: () => Array<Function>,
  applyFilters: (Array<MenuItemType>) => Array<MenuItemType>,
  filterPage: MenuItemType => boolean
}

export const generateFilterApi = (core: Core): PageFilterType => {
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
      filters.splice(filters.findIndex(x => x === filter), 1)
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
