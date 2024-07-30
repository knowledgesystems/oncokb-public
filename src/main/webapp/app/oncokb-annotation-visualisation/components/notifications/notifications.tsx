import React, { useState } from 'react';
import Alert from './../alert/Alert';
import { COLOR_ERROR } from './../../config/theme';
import './styles.scss';

interface NotificationImplication {
  message: string;
  type: 'danger' | 'primary' | 'warning' | 'success';
}

enum NotificationType {
  'danger' = 'exclamation-circle',
  'primary' = 'info-circle',
  'warning' = 'exclamation-triangle',
  'success' = 'check',
}

interface NotificationProps {
  notifications: NotificationImplication[];
}

const Notification: React.FC<NotificationProps> = ({ notifications }) => {
  const [show, setShow] = useState(false);
  const [showNotificationsCount, setShowNotificationsCount] = useState(true);

  const toggleShow = () => {
    setShow(!show);
    if (showNotificationsCount) setShowNotificationsCount(false);
  };

  return (
    <div className="notification-container">
      <div className="notification-icon-container">
        <i
          className="fa fa-bell fa-lg notification-icon"
          onClick={toggleShow}
          aria-hidden="true"
        >
          {showNotificationsCount && (
            <span className="notification-badge">
              {notifications.length > 10 ? '10+' : notifications.length}
            </span>
          )}
        </i>
      </div>
      {show && (
        <div className="notification-dropdown">
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <Alert key={notification.message} variant={notification.type}>
                <i
                  className={`fa fa-${
                    NotificationType[notification.type]
                  } mr-2`}
                  aria-hidden="true"
                ></i>
                {notification.message}
              </Alert>
            ))
          ) : (
            <Alert variant="warning">
              <i
                className={`fa fa-${NotificationType['warning']} mr-2`}
                aria-hidden="true"
              ></i>
              No Messages.
            </Alert>
          )}
        </div>
      )}
    </div>
  );
};

export default Notification;
