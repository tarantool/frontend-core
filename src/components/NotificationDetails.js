// @flow
import * as React from 'react'
import {
  Modal,
  PopupBody,
  PopupFooter,
  CopyToClipboard,
  Button
} from '@tarantool.io/ui-kit'

type NotificationDetailsProps = {
  showDetailsModal: boolean,
  children: string,
  setShowDetailsModal: (boolean) => void
};

const NotificationDetails = ({
  showDetailsModal,
  children: details,
  setShowDetailsModal
}: NotificationDetailsProps) => (
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
        >
          Copy details
        </CopyToClipboard>,
        <Button key="close" text='Close' onClick={() => setShowDetailsModal(false)} />
      ]}
    />
  </Modal>
);

export default NotificationDetails
