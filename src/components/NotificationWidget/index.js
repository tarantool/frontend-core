import * as React from 'react'
import { css, cx } from 'react-emotion'
import { connect } from 'react-redux'
import bell from './notification.svg'
import { clearNotifications, hideNotificationList, showNotificationList } from '../../store/actions/notifications'
import type { NotificationItem } from '../../store/reducers/notifications'
import Notification from '../Notification';

const styles = {
  container: css`
    position: relative;
  `,
  bell: css`
    width: 16px;
    height: 16px;
    position: relative;
    display: inline-block;
    cursor: pointer;
  `,
  bellActive: css`
    &:after{
      content: '';
      position: absolute;
      width: 6px;
      height: 6px;
      top: 0px;
      right: 0px;
      transform: translate3d(50%, -50%, 0);
      background-color: #f5222d;
      border-radius: 6px;
    }
  `,
  bellIcon: css`
    width: 16px;
    height: 16px;
  `,
  notificationList: css`
    position: absolute;
    top: 100%;
    right: 0;
    width: 336px;
    background: #fff;
    display: block;
    
    box-sizing: border-box;
    border-radius: 4px;
    box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.09);
    border: solid 1px rgba(82, 82, 82, 0.07);
    padding: 16px 0;
  `,
  clearButton: css`
    margin-top: 10px;
    text-align: right;
  `,
  notificationListContent: css`
    max-height: 230px;
    padding: 0 16px;
    overflow: auto;
  `,
  noNotification: css`
    font-size: 14px;
    font-family: Open Sans;
  `,
  listItem: css`
    border-bottom: 1px solid #e8e8e8;
    margin-bottom: 8px;
    &:last-child{
      border-bottom: none;
    } 
  `,
}

type NotificationWidgetProps = {
  notifications: Array<NotificationItem>,
  active: boolean,
  showList: boolean,
  dispatch: Function,
}

class NotificationWidget extends React.PureComponent<NotificationWidgetProps> {
  refEl = null;
  clickHandler = (e) => {
    if (this.refEl !== e.target && !this.refEl.contains(e.target) ) {
      this.props.dispatch(hideNotificationList())
    }
  }
  componentDidUpdate(prevProps: Readonly<NotificationWidgetProps>): void {
    if (prevProps.showList !== this.props.showList) {
      if (this.props.showList) {
        document.addEventListener('mousedown', this.clickHandler, true)
        document.addEventListener('touchstart', this.clickHandler, true)
      } else {
        document.removeEventListener('mousedown', this.clickHandler, true)
        document.removeEventListener('touchstart', this.clickHandler, true)
      }
    }
  }

  render(): React.ReactNode {
    const { dispatch, notifications, showList, active } = this.props;
    return <div className={styles.container} ref={r => this.refEl = r}>
      <div
        className={cx(styles.bell, active ? styles.bellActive : null)}

        onClick={() => {dispatch(showList ? hideNotificationList() : showNotificationList())}}
      >
        <img src={bell} className={styles.bellIcon} />
      </div>
      {showList && <div className={styles.notificationList}>
        <div className={styles.notificationListContent}>
          {notifications.length === 0 ? <span className={styles.noNotification}>No notifications</span> : null}
          {notifications.map(x => <Notification className={styles.listItem} {...x} isShort={true}/>)}
        </div>
        {
          notifications.length > 0 &&
          <div className={styles.clearButton} onClick={() => dispatch(clearNotifications())}>
            Clear
          </div>
        }
      </div>
      }
    </div>
  }
}

export default connect((state) => ({
  notifications: state.notifications.filter(x => x.hidden),
  active: state.notifications.filter(x => !x.read && x.hidden).length > 0,
  showList: state.ui.showNotificationList,
}))(NotificationWidget)