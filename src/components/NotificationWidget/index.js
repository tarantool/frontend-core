import * as React from 'react'
import { css, cx } from 'react-emotion'
import { connect } from 'react-redux'
import bell from './notification.svg'
import { hideNotificationList, showNotificationList } from '../../store/actions/notifications'
import type { NotificationItem } from '../../store/reducers/notifications'

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
}

type NotificationWidgetProps = {
  notifications: Array<NotificationItem>,
  active: boolean,
  showList: boolean,
  dispatch: Function,
}

class NotificationWidget extends React.Component<NotificationWidgetProps> {
  render(): React.ReactNode {
    const { dispatch, notifications, showList, active } = this.props;
    return <div className={styles.container}>
      <div
        className={cx(styles.bell, active ? styles.bellActive : null)}

        onClick={() => {dispatch(showList ? hideNotificationList() : showNotificationList())}}
      >
        <img src={bell} className={styles.bellIcon} />
      </div>
    </div>
  }
}

export default connect((state) => ({
  notifications: state.notifications.filter(x => x.hidden),
  active: state.notifications.filter(x => !x.read && x.hidden).length > 0,
  showList: state.ui.showNotificationList,
}))(NotificationWidget)
