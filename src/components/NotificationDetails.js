// @flow
import React, { useCallback } from 'react';
import { Button, CopyToClipboard, Markdown, Modal } from '@tarantool.io/ui-kit';

import type { NotificationItem } from '../store/reducers/notifications';

type NotificationDetailsProps = {
  notificationInModal: NotificationItem | null,
  setNotificationInModal: (NotificationItem | null) => void,
};

const NotificationDetails = ({ notificationInModal, setNotificationInModal }: NotificationDetailsProps) => {
  const { details, title } = notificationInModal || {};
  const handleClose = useCallback(() => setNotificationInModal(null), [setNotificationInModal]);
  return (
    <Modal
      title={title}
      visible={!!notificationInModal}
      onClose={handleClose}
      wide
      footerControls={[
        <CopyToClipboard key="copy" content={details}>
          Copy details
        </CopyToClipboard>,
        <Button key="close" text="Close" onClick={handleClose} />,
      ]}
    >
      <Markdown text={details} />
    </Modal>
  );
};

export default NotificationDetails;
