// @flow
import type { menuItem } from '../core';
import type { State } from './index'

const flattenMenu = (menuItems: menuItem[]): menuItem[] => {
  const queue = [...menuItems];
  let i = 0;

  do {
    const item = queue[i++];

    if (item && item.items && item.items.length) {
      queue.push(...item.items);
    }
  } while (i < queue.length);

  return queue;
};

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
