// @flow
import * as R from 'ramda';
import { createSelector } from 'reselect';

import type { MenuItemType } from '../core';
import { getFnByKey } from '../utils/disposableFnMap';
import type { State } from './index';
import type { NotificationItem } from './reducers/notifications';
import type { PageFilterState } from './reducers/pageFilter';

export const flattenMenu = (menuItems: MenuItemType[] = []): MenuItemType[] =>
  menuItems.reduce((acc, value) => (value && value.items ? [...acc, ...value.items] : acc), menuItems);

export const selectMenu = createSelector(
  (state) => state.pageFilter,
  (state) => state.menu,
  (filter: PageFilterState, menu: MenuItemType[]): MenuItemType[] => {
    const predicates = filter.map((predicateKey) => getFnByKey(predicateKey));
    const filteredMenu = R.filter(R.allPass(predicates))(menu);
    return filteredMenu.filter(Boolean).map((item) => {
      if (item && item.items && item.items.length > 0) {
        return {
          ...item,
          items: R.filter(R.allPass(predicates))(item.items),
        };
      }

      return item;
    });
  }
);

export const selectCurrentMenuItemLabel = (state: State): string => {
  const menu = flattenMenu(selectMenu(state));

  for (const item of menu) {
    if (item.selected) {
      return item.label;
    }
  }

  return '';
};

export const selectAppName = (state: State) => state.appTitle.appName;

export const selectTitle = (state: State) => state.appTitle.title || selectCurrentMenuItemLabel(state);

export const selectBreadcrumbs = (state: State): AppTitleProps[] => [
  ...state.appTitle.propsList.slice(0, -1),
  { title: selectTitle(state) },
];

export const selectActiveNotifications = (state: State): NotificationItem[] => state.notifications.active;

export const selectOutdatedNotifications = (state: State, ts: number): NotificationItem[] =>
  state.notifications.active.filter((x) => x.timeout > 0 && !x.pausedAt && ts - x.createdAt > x.timeout);

export const isExistsHiddenNonRead = createSelector(
  (state: State) => state.notifications.archive,
  (notifications) => !!notifications.find((x) => !x.read)
);

export const selectHiddenNotifications = createSelector(
  (state: State) => state.notifications.archive,
  (notifications: NotificationItem[]) => notifications.sort((a, b) => b.createdAt - a.createdAt)
);

export const selectRouteIsAllowed = createSelector(
  (state: State) => state.pageFilter,
  (state: State) => state.router.location.pathname,
  (filter: PageFilterState, path: string): boolean => {
    const predicates = filter.map((predicateKey) => getFnByKey(predicateKey));
    return R.allPass(predicates)({ path });
  }
);
