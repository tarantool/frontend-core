// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Button, PopupNotificationList } from '@tarantool.io/ui-kit';

import { hideNotification, pauseNotificationTimer, unpauseNotificationTimer } from '../store/actions/notifications';
import { selectActiveNotifications } from '../store/selectors';
import NotificationDetails from './NotificationDetails';

const getDetailsButtonText = (type) => (type === 'error' ? 'Error details' : 'More details');

const NotificationList = ({ notifications, dispatch }) => {
  const [notificationInModal, setNotificationInModal] = React.useState(null);

  return (
    <>
      <NotificationDetails {...{ notificationInModal, setNotificationInModal }} />
      <PopupNotificationList
        notifications={notifications.map((x) => ({
          heading: x.title,
          intent: x.type,
          onClose: () => dispatch(hideNotification(x.uuid)),
          onMouseEnter: () => dispatch(pauseNotificationTimer(x.uuid)),
          onMouseLeave: () => dispatch(unpauseNotificationTimer(x.uuid)),
          text: x.message,
          key: x.uuid,
          details: x.details && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setNotificationInModal(x);
                dispatch(pauseNotificationTimer(x.uuid));
              }}
              intent="base"
            >
              {getDetailsButtonText(x.type)}
            </Button>
          ),
        }))}
      />
    </>
  );
};

export default connect((state) => ({
  notifications: selectActiveNotifications(state),
}))(NotificationList);
