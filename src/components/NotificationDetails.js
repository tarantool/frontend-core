// @flow
import * as React from 'react'
import {
  Markdown,
  Modal,
  CopyToClipboard,
  Button
} from '@tarantool.io/ui-kit'
import type { NotificationItem } from '../store/reducers/notifications';

type NotificationDetailsProps = {
  notificationInModal: NotificationItem | null,
  setNotificationInModal: (NotificationItem | null) => void
};

const NotificationDetails = ({
  notificationInModal,
  setNotificationInModal
}: NotificationDetailsProps) => {
  const { details, title } = (notificationInModal || {});
  return (
    <Modal
      title={title}
      visible={!!notificationInModal}
      onClose={() => setNotificationInModal(null)}
      wide
      footerControls={[
        <CopyToClipboard
          key="copy"
          content={details}
        >
        Copy details
        </CopyToClipboard>,
        <Button key="close" text='Close' onClick={() => setNotificationInModal(null)} />
      ]}
    >
      <Markdown text={details} />
    </Modal>
  );
};

export default NotificationDetails
