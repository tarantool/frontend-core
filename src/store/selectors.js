// @flow
import type { menuItem } from '../core'
import type { State } from './index'
import type { NotificationItem } from './reducers/notifications'
import { createSelector } from 'reselect'

export const flattenMenu = (menuItems: menuItem[] = []): menuItem[] => menuItems.reduce(
  (acc, { items }) => (items ? [...acc, ...items] : acc),
  menuItems
);

const selectMenu = (state: State): menuItem[] => state.menu;

export const selectCurrentMenuItemLabel = (state: State): string => {
  const menu = flattenMenu(selectMenu(state));

  for (const item of menu) {
    if (item.selected) {
      return item.label;
    }
  }

  return '';
};
export const selectTitle = (state: State) => state.appTitle.title || selectCurrentMenuItemLabel(state)
export const selectBreadcrumbs = (state: State): AppTitleProps[] => state.appTitle.propsList.slice(0, -1)


export const selectActiveNotifications = (state: State): NotificationItem[] => state.notifications.filter(x => !x.hidden)

export const isExistsHiddenNonRead = createSelector(
  (state: State) => state.notifications,
  notifications => notifications.filter(x => !x.read && x.hidden).length > 0,
)

export const selectHiddenNotifications = createSelector(
  (state: State) => state.notifications,
  notifications => notifications.filter(x => x.hidden),
)
