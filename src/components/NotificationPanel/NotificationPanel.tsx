import React, { useEffect, useState } from 'react'
import Notification, { NotificationElement } from './Notification';
import './NotificationPanel.scss'
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
const NotificationPanel = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);

  const sampleNotifications: Array<NotificationElement> = [
    { id: 1, title: "Thông báo 1", content: "YCSX 1F80008, code GH63-14904A đã được lên chỉ thị sản xuất công đoạn FR", time: "2024-12-28 15:30:25", EMPL_NO:'NHU1903' },
    { id: 2, title: "Thông báo 1", content: "YCSX 1F80008, code GH63-14904A đã được lên chỉ thị sản xuất công đoạn FR", time: "2024-12-28 15:30:25", EMPL_NO:'NHU1903' },
    { id: 3, title: "Thông báo 1", content: "YCSX 1F80008, code GH63-14904A đã được lên chỉ thị sản xuất công đoạn FR", time: "2024-12-28 15:30:25", EMPL_NO:'NHU1903' },
    { id: 4, title: "Thông báo 2", content: "Content 2", time: "2024-12-28 15:30:25", EMPL_NO:'NHU1903' },
    { id: 5, title: "Thông báo 3", content: "Content 3", time: "2024-12-28 15:30:25", EMPL_NO:'NHU1903' },
    { id: 6, title: "Thông báo 3", content: "Content 3", time: "2024-12-28 15:30:25", EMPL_NO:'NHU1903' },
    { id: 7, title: "Thông báo 3", content: "Content 3", time: "2024-12-28 15:30:25", EMPL_NO:'NHU1903' },
    { id: 8, title: "Thông báo 3", content: "Content 3", time: "2024-12-28 15:30:25", EMPL_NO:'NHU1903' },
    { id: 9, title: "Thông báo 3", content: "Content 3", time: "2024-12-28 15:30:25", EMPL_NO:'NHU1903' },
    { id: 10, title: "Thông báo 3", content: "Content 3", time: "2024-12-28 15:30:25", EMPL_NO:'NHU1903' },
    { id: 11, title: "Thông báo 3", content: "Content 3", time: "2024-12-28 15:30:25", EMPL_NO:'NHU1903' },
  ]
  const [notifications, setNotifications] = useState<Array<NotificationElement>>(sampleNotifications);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
      
      
  }, []);

  return (
      <div className="notification-list" style={{ backgroundImage: theme.CMS.backgroundImage, color: 'gray' }}>
          {notifications.map(notification => (
              <Notification  EMPL_NO={notification.EMPL_NO} key={notification.id}  id={notification.id} title={notification.title} content={notification.content} time={notification.time}/>
          ))}
      </div>
  );
}

export default NotificationPanel