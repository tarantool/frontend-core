// @flow
import type { menuItem } from '../core';
import type { State } from './index'

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
