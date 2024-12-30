import React, { useEffect, useState } from 'react'
import Notification, { NotificationElement } from './Notification';
import './NotificationPanel.scss'
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
const NotificationPanel = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);

  const sampleNotifications: Array<NotificationElement> = [
   
  ]
  const [notifications, setNotifications] = useState<Array<NotificationElement>>(sampleNotifications);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const handle_loadNotifications = () => {
      
  }

  useEffect(() => {
      
      
  }, []);

  return (
      <div className="notification-list" style={{ backgroundImage: theme.CMS.backgroundImage, color: 'gray' }}>
          {notifications.map(notification => (
              <Notification notidata={notification}/>
          ))}
      </div>
  );
}

export default NotificationPanel