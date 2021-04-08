// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import { Button, PopupNotificationList } from '@tarantool.io/ui-kit'
import { selectActiveNotifications } from '../store/selectors';
import NotificationDetails from './NotificationDetails';
import { hideNotification } from '../store/actions/notifications';

const getDetailsButtonText = type => (
  type === 'error' ? 'Error details' : 'More details'
);

const NotificationList = ({ notifications, dispatch }) => {
  const [notificationInModal, setNotificationInModal] = React.useState(null);

  return (
    <>
      <NotificationDetails {...{ notificationInModal, setNotificationInModal }} />
      <PopupNotificationList
        notifications={notifications.map(x => ({
          heading: x.title,
          intent: x.type,
          onClose: () => dispatch(hideNotification(x.uuid)),
          text: x.message,
          key: x.uuid,
          details: x.details &&
            <Button onClick={() => setNotificationInModal(x)} intent='base'>
              {getDetailsButtonText(x.type)}
            </Button>
        }))}
      />
    </>
  )
}

export default connect(state => ({
  notifications: selectActiveNotifications(state)
}))(NotificationList)
