import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, MenuItem, Tooltip } from "@mui/material";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import NotificationsOffRoundedIcon from "@mui/icons-material/NotificationsOffRounded";
import { FiBell, FiRefreshCw, FiX, FiArrowRight } from "../icons/localIconSet";
import Notification, { NotificationElement } from "./Notification";
import { f_load_Notification_Data } from "../../api/services/notificationService";
import { resolveNotificationRoute } from "../../api/services/notificationRoute";
import {
  getNotiMuteUntil,
  isNotiMuteUntilOpen,
  notiMuteSecondsLeft,
  setNotiMute,
  subscribeNotiMute,
  type NotiMuteOption,
} from "../../api/services/notificationMuteService";
import "./NotificationPanel.scss";

interface NotificationPanelProps {
  onClose?: () => void;
}

type TabType = "ALL" | "UNREAD" | "YCSX" | "RND";

/** Thời lượng tắt thông báo nổi (giống module chat). */
const MUTE_OPTIONS: { label: string; value: NotiMuteOption }[] = [
  { label: "Trong 10 phút", value: 10 },
  { label: "Trong 1 giờ", value: 60 },
  { label: "Trong 4 giờ", value: 240 },
  { label: "Trong 1 ngày", value: 1440 },
  { label: "Cho tới khi tôi bật lại", value: "untilOpen" },
];

/** Ví dụ: "1 giờ 5 phút", "2 ngày 3 giờ". */
function formatMuteRemaining(seconds: number): string {
  if (seconds >= 86400) {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    return h > 0 ? `${d} ngày ${h} giờ` : `${d} ngày`;
  }
  if (seconds >= 3600) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return m > 0 ? `${h} giờ ${m} phút` : `${h} giờ`;
  }
  return `${Math.max(1, Math.round(seconds / 60))} phút`;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Array<NotificationElement>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("ALL");
  const [readIds, setReadIds] = useState<Set<number>>(new Set());
  const [muteAnchor, setMuteAnchor] = useState<HTMLElement | null>(null);
  // Dùng "tick" để đọc lại trạng thái tắt thông báo mỗi khi có thay đổi / mỗi 30s.
  const [, forceTick] = useState(0);

  const muteUntil = getNotiMuteUntil();
  const muted = muteUntil !== null;
  const muteSecondsLeft = notiMuteSecondsLeft();
  const muteUntilOpen = isNotiMuteUntilOpen(muteSecondsLeft);
  const muteLabel = muteSecondsLeft ? formatMuteRemaining(muteSecondsLeft) : "";

  useEffect(() => {
    const unsubscribe = subscribeNotiMute(() => forceTick((v) => v + 1));
    return unsubscribe;
  }, []);

  // Khi đang tắt, cập nhật nhãn "còn lại" mỗi 30 giây.
  useEffect(() => {
    if (!muted) return;
    const timer = window.setInterval(() => forceTick((v) => v + 1), 30_000);
    return () => window.clearInterval(timer);
  }, [muted]);

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

    // Điều hướng thẳng tới màn nghiệp vụ tương ứng để người dùng xử lý ngay.
    const route = resolveNotificationRoute(item);
    if (route) {
      onClose?.();
      navigate(route);
    }
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
          <Tooltip
            title={
              muted
                ? muteUntilOpen
                  ? "Đang tắt thông báo nổi cho tới khi bạn bật lại · bấm để đổi"
                  : `Đang tắt thông báo nổi (còn ${muteLabel}) · bấm để đổi`
                : "Tắt thông báo nổi (snackbar)"
            }
          >
            <button
              type="button"
              className={`stitch-noti-panel__muteBtn${muted ? " is-muted" : ""}`}
              onClick={(event) => setMuteAnchor(event.currentTarget)}
              aria-label="Tắt thông báo nổi"
              aria-pressed={muted}
            >
              {muted ? <NotificationsOffRoundedIcon fontSize="small" /> : <NotificationsActiveRoundedIcon fontSize="small" />}
            </button>
          </Tooltip>
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

      {/* Banner báo đang tắt thông báo nổi */}
      {muted && (
        <div className="stitch-noti-panel__muteBar">
          <NotificationsOffRoundedIcon sx={{ fontSize: 14 }} />
          <span className="stitch-noti-panel__muteBarText">
            {muteUntilOpen
              ? "Đang tắt thông báo nổi cho tới khi bạn tự bật lại"
              : `Đang tắt thông báo nổi · còn ${muteLabel}`}
          </span>
          <button
            type="button"
            className="stitch-noti-panel__muteBarBtn"
            onClick={() => setNotiMute(null)}
          >
            Bật lại
          </button>
        </div>
      )}

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

      {/* Menu tắt thông báo nổi (snackbar) */}
      <Menu
        anchorEl={muteAnchor}
        open={Boolean(muteAnchor)}
        onClose={() => setMuteAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem disabled sx={{ fontSize: 12, opacity: "1 !important", fontWeight: 700 }}>
          Tắt thông báo nổi (snackbar)
        </MenuItem>
        {MUTE_OPTIONS.map((option) => (
          <MenuItem
            key={option.label}
            sx={{ fontSize: 13 }}
            onClick={() => {
              setMuteAnchor(null);
              setNotiMute(option.value);
            }}
          >
            {option.label}
          </MenuItem>
        ))}
        {muted && (
          <MenuItem
            sx={{ fontSize: 13, color: "#dc2626" }}
            onClick={() => {
              setMuteAnchor(null);
              setNotiMute(null);
            }}
          >
            Bật lại thông báo
          </MenuItem>
        )}
        {muted && (
          <MenuItem disabled sx={{ fontSize: 11, opacity: "1 !important", color: "#64748b" }}>
            {muteUntilOpen
              ? "Đang tắt cho tới khi bạn tự bật lại"
              : `Còn ${muteLabel} · thông báo vẫn vào danh sách, chỉ ẩn snackbar`}
          </MenuItem>
        )}
      </Menu>
    </div>
  );
};

export default NotificationPanel;