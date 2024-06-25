import React from 'react';
import '../pages/Member/Notifications.css';

const NotificationItem = ({ notification, onDelete }) => {
  return (
    <div className="notification-item">
      <p>{notification.message}</p>
      <p>{notification.date_posted}</p>
      <button onClick={onDelete} className="delete-btn">&times;</button>
    </div>
  );
};

export default NotificationItem;
