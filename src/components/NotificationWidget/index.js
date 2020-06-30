// @flow
import * as React from 'react'
import { css, cx } from 'react-emotion'
import { connect } from 'react-redux'
import {
  Button
} from '@tarantool.io/ui-kit'
import bell from './notification.svg'
import { clearNotifications, hideNotificationList, showNotificationList } from '../../store/actions/notifications'
import type { NotificationItem } from '../../store/reducers/notifications'
import Notification from '../Notification'
import NotificationDetails from '../NotificationDetails'
import { isExistsHiddenNonRead, selectHiddenNotifications } from '../../store/selectors'
import { AutoScroll } from '../AutoScroll'

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
    &:after {
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
    z-index: 1;
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
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    padding: 10px 16px 0;
  `,
  notificationListContent: css`
    max-height: 230px;

    overflow: auto;
  `,
  notificationInner: css`
    padding: 0 16px;
  `,
  noNotification: css`
    font-size: 14px;
    font-family: Open Sans;
  `,
  listItem: css`
    border-bottom: 1px solid #e8e8e8;
    margin-bottom: 8px;
    &:last-child {
      border-bottom: none;
    }
  `
}

type NotificationWidgetProps = {
  notifications: Array<NotificationItem>,
  active: boolean,
  showList: boolean,
  dispatch: Function
}

type NotificationWidgetState = {
  notificationInModal: NotificationItem | null
}

class NotificationWidget extends React.PureComponent<NotificationWidgetProps, NotificationWidgetState> {
  state = { notificationInModal: null }
  refEl = React.createRef<HTMLElement>();
  clickHandler = (e: MouseEvent | TouchEvent) => {
    if (
      e.target instanceof Node &&
      this.refEl.current &&
      this.refEl.current !== e.target &&
      !this.refEl.current.contains(e.target)
    ) {
      this.props.dispatch(hideNotificationList())
    }
  }
  componentDidUpdate(prevProps: NotificationWidgetProps): void {
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

  setNotificationInModal = (notificationInModal: NotificationItem | null) => {
    this.setState({ notificationInModal });
  }

  render() {
    const { dispatch, notifications, showList, active } = this.props;
    const { notificationInModal } = this.state;
    return (
      <div className={styles.container} ref={this.refEl}>
        <NotificationDetails {...{ notificationInModal, setNotificationInModal: this.setNotificationInModal }} />
        <div
          className={cx(styles.bell, active ? styles.bellActive : null)}
          onClick={() => {
            dispatch(showList ? hideNotificationList() : showNotificationList())
          }}
        >
          <img src={bell} className={styles.bellIcon} />
        </div>
        {showList && (
          <div className={styles.notificationList}>
            <div className={styles.notificationListContent}>
              <AutoScroll maxHeight={230}>
                <div className={styles.notificationInner}>
                  {notifications.length === 0 ? <span className={styles.noNotification}>No notifications</span> : null}
                  {notifications.map(x => (
                    <Notification
                      {...x}
                      key={x.uuid}
                      className={styles.listItem}
                      onDetailsClick={details => this.setNotificationInModal(x)}
                      isShort={true}
                    />
                  ))}
                </div>
              </AutoScroll>
            </div>
            {notifications.length > 0 && (
              <div className={styles.clearButton}>
                <Button text={'Clear'} onClick={() => dispatch(clearNotifications())} />
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
}

export default connect(state => ({
  notifications: selectHiddenNotifications(state),
  active: isExistsHiddenNonRead(state),
  showList: state.ui.showNotificationList
}))(NotificationWidget)
