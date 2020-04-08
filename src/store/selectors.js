// @flow
import type { MenuItemType } from '../core'
import type { State } from './index'
import type { NotificationItem } from './reducers/notifications'
import { createSelector } from 'reselect'
import * as R from 'ramda'
import { getFnByKey } from '../utils/disposableFnMap'
import type { PageFilterState } from './reducers/pageFilter'

export const flattenMenu = (menuItems: MenuItemType[] = []): MenuItemType[] =>
  menuItems.reduce((acc, { items }) => (items ? [...acc, ...items] : acc), menuItems)

export const selectMenu = createSelector<State, PageFilterState, MenuItemType[], MenuItemType[]>(
  (state) => state.pageFilter,
  (state) => state.menu,
  (filter: PageFilterState, menu: MenuItemType[]): MenuItemType[] => {
    const predicates = filter.map(predicateKey => getFnByKey(predicateKey))
    return R.filter(R.allPass(predicates))(menu)
  }
)

export const selectCurrentMenuItemLabel = (state: State): string => {
  const menu = flattenMenu(selectMenu(state))

  for (const item of menu) {
    if (item.selected) {
      return item.label
    }
  }

  return ''
}
export const selectTitle = (state: State) => state.appTitle.title || selectCurrentMenuItemLabel(state)
export const selectBreadcrumbs = (state: State): AppTitleProps[] => [
  ...state.appTitle.propsList.slice(0, -1),
  { title: selectTitle(state) }
]

export const selectActiveNotifications = (state: State): NotificationItem[] => state.notifications.active

export const selectOutdatedNotifications = (state: State, ts: number): NotificationItem[] =>
  state.notifications.active.filter(x => x.timeout > 0 && !x.pausedAt && ts - x.createdAt > x.timeout)

export const isExistsHiddenNonRead = createSelector(
  (state: State) => state.notifications.archive,
  notifications => !!notifications.find(x => !x.read)
)

export const selectHiddenNotifications = createSelector(
  (state: State) => state.notifications.archive,
  (notifications: NotificationItem[]) => notifications.sort((a, b) => b.createdAt - a.createdAt)
)

export const selectRouteIsAllowed = createSelector<State, PageFilterState, string, boolean>(
  (state: State) => state.pageFilter,
  (state: State) => state.router.location.pathname,
  (filter: PageFilterState, path: string): boolean => {
    const predicates = filter.map(predicateKey => getFnByKey(predicateKey))

    return R.allPass(predicates)({ path });
  }
)
