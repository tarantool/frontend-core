import * as React from 'react'
import { css } from 'emotion'
import { connect } from 'react-redux'
import {
  Modal,
  PopupBody,
  PopupFooter,
  CopyToClipboard,
  Button
} from '@tarantool.io/ui-kit'
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

const handleDetailsClick = (details, setDetails, setShowDetailsModal) => {
  setDetails(details);
  setShowDetailsModal(true);
};

export default connect(state => ({
  notifications: selectActiveNotifications(state)
}))(({ notifications, dispatch }) => {
  const [details, setDetails] = React.useState(null);
  const [showDetailsModal, setShowDetailsModal] = React.useState(false);

  return (
    <div className={styles.container}>
      <Modal
        title='Details'
        visible={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
      >
        <PopupBody>{details}</PopupBody>
        <PopupFooter
          controls={[
            <CopyToClipboard
              key="copy"
              content={details}
              size='s'
              intent='iconic'
            >
              Copy details
            </CopyToClipboard>,
            <Button key="close" text='Close' onClick={() => setShowDetailsModal(false)} />
          ]}
        />
      </Modal>
      <div className={styles.innerContainer}>
        {notifications.map(x => (
          <Notification
            key={x.uuid}
            {...x}
            onDetailsClick={details => handleDetailsClick(details, setDetails, setShowDetailsModal)}
            dispatch={dispatch}
            className={styles.item}
          />
        ))}
      </div>
    </div>
  )
})
