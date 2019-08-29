import * as React from 'react'
import { css } from 'emotion'
import { connect } from 'react-redux'
import { selectActiveNotifications } from '../store/selectors'
import Notification from './Notification'

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

export default connect(state => ({
  notifications: selectActiveNotifications(state)
}))(({ notifications, dispatch }) => {
  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        {notifications.map(x => (
          <Notification key={x.uuid} {...x} dispatch={dispatch} className={styles.item} />
        ))}
      </div>
    </div>
  )
})
