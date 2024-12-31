import React, { useEffect, useState } from 'react'
import Notification, { NotificationElement } from './Notification';
import './NotificationPanel.scss'
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { f_load_Notification_Data } from '../../api/GlobalFunction';
const NotificationPanel = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);

  const sampleNotifications: Array<NotificationElement> = [
   
  ]
  const [notifications, setNotifications] = useState<Array<NotificationElement>>(sampleNotifications);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const handle_loadNotifications = async () => {
    setNotifications(await f_load_Notification_Data());
  }

  useEffect(() => {
    handle_loadNotifications();      
      
  }, []);

  return (
      <div className="notification-list" style={{ backgroundImage: theme.CMS.backgroundImage, color: 'gray' }}>
        <div className="title">
            Notifications
        </div>
          {notifications.map(notification => (
              <Notification key={notification.NOTI_ID} notidata={notification}/>
          ))}
      </div>
  );
}

export default NotificationPanel