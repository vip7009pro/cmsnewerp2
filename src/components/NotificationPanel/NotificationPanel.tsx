import React, { useEffect, useMemo, useState } from "react";
import {
  FiBell,
  FiRefreshCw,
  FiX,
  FiArrowRight,
} from "react-icons/fi";
import Notification, { NotificationElement } from "./Notification";
import { f_load_Notification_Data } from "../../api/services/notificationService";
import "./NotificationPanel.scss";

interface NotificationPanelProps {
  onClose?: () => void;
}

type TabType = "ALL" | "UNREAD" | "YCSX" | "RND";

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose }) => {
  const [notifications, setNotifications] = useState<Array<NotificationElement>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("ALL");
  const [readIds, setReadIds] = useState<Set<number>>(new Set());

  const handleLoadNotifications = async () => {
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
  };

  useEffect(() => {
    handleLoadNotifications();
  }, []);

  const handleMarkAllRead = () => {
    const allIds = new Set(notifications.map((n) => n.NOTI_ID));
    setReadIds(allIds);
  };

  const handleItemClick = (item: NotificationElement) => {
    setReadIds((prev) => new Set(prev).add(item.NOTI_ID));
  };

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !readIds.has(n.NOTI_ID)).length;
  }, [notifications, readIds]);

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      if (activeTab === "UNREAD") {
        return !readIds.has(item.NOTI_ID);
      }
      if (activeTab === "YCSX") {
        const text = `${item.TITLE} ${item.CONTENT} ${item.SUBDEPTNAME}`.toUpperCase();
        return text.includes("YCSX") || text.includes("KD") || text.includes("KINH DOANH");
      }
      if (activeTab === "RND") {
        const text = `${item.TITLE} ${item.CONTENT} ${item.SUBDEPTNAME}`.toUpperCase();
        return text.includes("RND") || text.includes("R&D") || text.includes("BOM");
      }
      return true;
    });
  }, [notifications, activeTab, readIds]);

  return (
    <div className="stitch-noti-panel" role="dialog" aria-label="Trung tâm thông báo">
      {/* 1. Header Section */}
      <div className="stitch-noti-panel__header">
        <div className="stitch-noti-panel__headerLeft">
          <div className="stitch-noti-panel__bellBadge">
            <FiBell size={15} />
          </div>
          <div className="stitch-noti-panel__headerTitles">
            <div className="stitch-noti-panel__titleRow">
              <h2 className="stitch-noti-panel__title">Trung Tâm Thông Báo</h2>
              <span className="stitch-noti-panel__countPill">
                {notifications.length > 0 ? `${notifications.length}+` : "0"}
              </span>
            </div>
            <p className="stitch-noti-panel__subTitle">
              Cập nhật thời gian thực (Realtime Socket.io)
            </p>
          </div>
        </div>

        <div className="stitch-noti-panel__headerRight">
          <button
            type="button"
            className="stitch-noti-panel__refreshBtn"
            onClick={handleLoadNotifications}
            title="Làm mới danh sách thông báo"
          >
            <FiRefreshCw size={12} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
          <span className="stitch-noti-panel__tzBadge">GMT+7</span>
          {onClose && (
            <button
              type="button"
              className="stitch-noti-panel__closeBtn"
              onClick={onClose}
              title="Đóng"
            >
              <FiX size={15} />
            </button>
          )}
        </div>
      </div>

      {/* 2. Quick Filter Tabs */}
      <div className="stitch-noti-panel__tabsBar">
        <div className="stitch-noti-panel__tabsLeft">
          <button
            type="button"
            className={`stitch-noti-panel__tabBtn ${
              activeTab === "ALL" ? "stitch-noti-panel__tabBtn--active" : ""
            }`}
            onClick={() => setActiveTab("ALL")}
          >
            Tất cả ({notifications.length})
          </button>
          <button
            type="button"
            className={`stitch-noti-panel__tabBtn ${
              activeTab === "UNREAD" ? "stitch-noti-panel__tabBtn--active" : ""
            }`}
            onClick={() => setActiveTab("UNREAD")}
          >
            Chưa đọc ({unreadCount})
          </button>
          <button
            type="button"
            className={`stitch-noti-panel__tabBtn ${
              activeTab === "YCSX" ? "stitch-noti-panel__tabBtn--active" : ""
            }`}
            onClick={() => setActiveTab("YCSX")}
          >
            YCSX
          </button>
          <button
            type="button"
            className={`stitch-noti-panel__tabBtn ${
              activeTab === "RND" ? "stitch-noti-panel__tabBtn--active" : ""
            }`}
            onClick={() => setActiveTab("RND")}
          >
            R&D
          </button>
        </div>

        <button
          type="button"
          className="stitch-noti-panel__markAllBtn"
          onClick={handleMarkAllRead}
        >
          Đã đọc tất cả
        </button>
      </div>

      {/* 3. Notification List Body */}
      <div className="stitch-noti-panel__body custom-scroll" role="list">
        {loading && (
          <div className="stitch-noti-panel__state">
            Đang tải thông báo hệ thống...
          </div>
        )}
        {!loading && error && (
          <div className="stitch-noti-panel__state stitch-noti-panel__state--error">
            {error}
          </div>
        )}
        {!loading && !error && filteredNotifications.length === 0 && (
          <div className="stitch-noti-panel__state">
            Không có thông báo nào trong mục này.
          </div>
        )}
        {!loading &&
          !error &&
          filteredNotifications.map((notification) => (
            <Notification
              key={notification.NOTI_ID}
              notidata={notification}
              isUnread={!readIds.has(notification.NOTI_ID)}
              onClick={handleItemClick}
            />
          ))}
      </div>

      {/* 4. Footer Section */}
      <div className="stitch-noti-panel__footer">
        <div className="stitch-noti-panel__footerLeft">
          <span className="dot" />
          <span>Hồ sơ thi đua khen thưởng</span>
          <span className="divider">•</span>
          <span>Ko tính CN & nửa phép</span>
        </div>
        <button
          type="button"
          className="stitch-noti-panel__viewAllBtn"
          onClick={() => {
            setActiveTab("ALL");
          }}
        >
          <span>Xem tất cả thông báo</span>
          <FiArrowRight size={12} />
        </button>
      </div>
    </div>
  );
};

export default NotificationPanel;