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
  const [error, setError] = useState<string | null>(null);

  const handle_loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await f_load_Notification_Data();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setNotifications([]);
      setError(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    handle_loadNotifications();      
  }, []);

  return (
    <div className="notification-list" style={{ backgroundImage: theme.CMS.backgroundImage }}>
      <div className="notification-list__header">
        <div className="notification-list__title">Notifications</div>
        <div className="notification-list__meta">
          <span className="notification-list__count">{notifications.length}</span>
          <button className="notification-list__refresh" type="button" onClick={handle_loadNotifications}>
            Refresh
          </button>
        </div>
      </div>

      <div className="notification-list__body" role="list" aria-busy={loading ? 'true' : 'false'}>
        {loading && <div className="notification-list__state">Loading notifications...</div>}
        {!loading && error && <div className="notification-list__state notification-list__state--error">{error}</div>}
        {!loading && !error && notifications.length === 0 && (
          <div className="notification-list__state">No notifications</div>
        )}
        {!loading && !error && notifications.map(notification => (
          <Notification key={notification.NOTI_ID} notidata={notification}/>
        ))}
      </div>
    </div>
  );
}

export default NotificationPanel