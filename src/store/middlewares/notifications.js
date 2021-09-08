// @flow
import * as R from 'ramda';

import type { FSA } from '../../core';
import { checkNotifications, garbageNotifications } from '../actions/notifications';
import { notificationFields } from '../reducers/notifications';
import type { NotificationState } from '../reducers/notifications';
import { selectOutdatedNotifications } from '../selectors';

export const notificationStorageKey = 'tarantool_enterprise_notifications_storage';

export const startTimerCheckNotifications = (store: Object) => {
  setInterval(() => {
    const state = store.getState();
    const now = Date.now();
    if (selectOutdatedNotifications(state, now).length > 0) {
      store.dispatch(checkNotifications(now));
    }
  }, 1000);
  store.dispatch(garbageNotifications(Date.now()));
  setInterval(() => {
    store.dispatch(garbageNotifications(Date.now()));
  }, 1000 * 60 * 5);
};

export const zipData = (notifications: NotificationState) => {
  return JSON.stringify({
    scheme: notificationFields,
    active: R.map(R.props(notificationFields), notifications.active),
    archive: R.map(R.props(notificationFields), notifications.archive),
  });
};

export const unzipData = (stringData: ?string) => {
  if (!stringData) {
    return {
      active: [],
      archive: [],
    };
  }
  try {
    const data = JSON.parse(stringData);
    const scheme = data.scheme;
    return {
      active: R.map(R.zipObj(scheme), data.active),
      archive: R.map(R.zipObj(scheme), data.archive),
    };
  } catch (e) {
    return {
      active: [],
      archive: [],
    };
  }
};

export const saveNotificationsMiddleware = (store: Object) => (next: Function) => (action: FSA) => {
  const notificationBefore = store.getState().notifications;
  const result = next(action);
  const notificationsAfter = store.getState().notifications;

  if (notificationsAfter !== notificationBefore) {
    localStorage.setItem(notificationStorageKey, zipData(notificationsAfter));
  }

  return result;
};
