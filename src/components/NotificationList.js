// @flow
import * as React from 'react'
import { css } from 'emotion'
import { connect } from 'react-redux'
import { selectActiveNotifications } from '../store/selectors'
import Notification from './Notification'
import NotificationDetails from './NotificationDetails'

const styles = {
  container: css`
    position: fixed;
    right: 24px;
    bottom: 24px;
    z-index: 10;
  `,
  innerContainer: css`
    position: relative;
  `,
  item: css`
    margin-top: 24px;
  `
}

const NotificationList = ({ notifications, dispatch }) => {
  const [notificationInModal, setNotificationInModal] = React.useState(null);

  return (
    <div className={styles.container}>
      <NotificationDetails {...{ notificationInModal, setNotificationInModal }} />
      <div className={styles.innerContainer}>
        {notifications.map(x => (
          <Notification
            key={x.uuid}
            {...x}
            onDetailsClick={details => {
              setNotificationInModal(x);
            }}
            dispatch={dispatch}
            className={styles.item}
          />
        ))}
      </div>
    </div>
  )
}

export default connect(state => ({
  notifications: selectActiveNotifications(state)
}))(NotificationList)
