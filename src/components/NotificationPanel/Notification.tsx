import React from "react";
import moment from "moment";
import {
  FiCheck,
  FiInfo,
  FiLayers,
  FiAlertTriangle,
  FiBell,
  FiBriefcase,
  FiArrowRight,
} from "react-icons/fi";
import "./Notification.scss";

export interface NotificationElement {
  CTR_CD: string;
  NOTI_ID: number;
  NOTI_TYPE: string;
  TITLE: string;
  CONTENT: string;
  SUBDEPTNAME: string;
  MAINDEPTNAME: string;
  INS_EMPL: string;
  INS_DATE: string;
  UPD_EMPL: string;
  UPD_DATE: string;
}

interface NotificationProps {
  notidata: NotificationElement;
  onClick?: (item: NotificationElement) => void;
  isUnread?: boolean;
}

interface NotificationTheme {
  variant: "emerald" | "sky" | "indigo" | "rose" | "slate";
  icon: JSX.Element;
  categoryTag: string;
  actionText: string;
}

/**
 * Ánh xạ phân hệ & ngữ cảnh nghiệp vụ sang theme màu sắc Google Stitch
 */
const resolveNotificationTheme = (item: NotificationElement): NotificationTheme => {
  const combined = `${item.TITLE || ""} ${item.CONTENT || ""} ${item.SUBDEPTNAME || ""} ${item.MAINDEPTNAME || ""} ${item.NOTI_TYPE || ""}`.toUpperCase();

  if (combined.includes("YCSX") || combined.includes("KINH DOANH") || combined.includes("KD") || item.NOTI_TYPE?.toLowerCase() === "success") {
    return {
      variant: "emerald",
      icon: <FiCheck size={16} strokeWidth={2.5} />,
      categoryTag: "YCSX",
      actionText: "Xem chi tiết chỉ thị",
    };
  }

  if (combined.includes("RND") || combined.includes("R&D") || combined.includes("BOM") || combined.includes("SẢN PHẨM")) {
    return {
      variant: "sky",
      icon: <FiInfo size={16} strokeWidth={2.5} />,
      categoryTag: "RND",
      actionText: "Kiểm tra bản vẽ",
    };
  }

  if (combined.includes("QLSX") || combined.includes("SẢN XUẤT") || combined.includes("ĐỊNH MỨC") || combined.includes("CAPA")) {
    return {
      variant: "indigo",
      icon: <FiLayers size={16} strokeWidth={2} />,
      categoryTag: "QLSX",
      actionText: "Xem thông số CAPA",
    };
  }

  if (combined.includes("QC") || combined.includes("VOC") || combined.includes("LỖI") || item.NOTI_TYPE?.toLowerCase() === "warning" || item.NOTI_TYPE?.toLowerCase() === "error") {
    return {
      variant: "rose",
      icon: <FiAlertTriangle size={16} strokeWidth={2} />,
      categoryTag: "QC4",
      actionText: "Xem ảnh lỗi VOC",
    };
  }

  return {
    variant: "slate",
    icon: <FiBell size={16} strokeWidth={2} />,
    categoryTag: item.SUBDEPTNAME || "HỆ THỐNG",
    actionText: "Xem chi tiết",
  };
};

const formatNotificationTime = (dateStr: string) => {
  if (!dateStr) return "";
  const m = moment(dateStr);
  return m.isValid() ? m.format("HH:mm DD/MM/YYYY") : dateStr;
};

export const Notification: React.FC<NotificationProps> = ({
  notidata,
  onClick,
  isUnread = true,
}) => {
  const theme = resolveNotificationTheme(notidata);
  const timeFormatted = formatNotificationTime(notidata.INS_DATE);
  const departmentName = notidata.MAINDEPTNAME || notidata.SUBDEPTNAME || "Toàn công ty";

  return (
    <div
      className={`stitch-noti-card stitch-noti-card--${theme.variant}`}
      role="listitem"
      tabIndex={0}
      onClick={() => onClick?.(notidata)}
    >
      <div className="stitch-noti-card__wrapper">
        {/* Icon Avatar Box */}
        <div className="stitch-noti-card__iconBox">
          {theme.icon}
        </div>

        {/* Content Body */}
        <div className="stitch-noti-card__body">
          {/* Top Line: Title + Tag + Time */}
          <div className="stitch-noti-card__topRow">
            <div className="stitch-noti-card__titleGroup">
              <span className="stitch-noti-card__title" title={notidata.TITLE}>
                {notidata.TITLE}
              </span>
              <span className="stitch-noti-card__categoryBadge">
                {theme.categoryTag}
              </span>
            </div>
            <span className="stitch-noti-card__time">
              {timeFormatted}
            </span>
          </div>

          {/* Description Text */}
          <p className="stitch-noti-card__content">
            {notidata.CONTENT}
          </p>

          {/* Sub-details Footer inside card */}
          <div className="stitch-noti-card__footer">
            <span className="stitch-noti-card__dept">
              <FiBriefcase size={12} />
              <span>Bộ phận: {departmentName}</span>
            </span>
            <span className="stitch-noti-card__actionLink">
              <span>{theme.actionText}</span>
              <FiArrowRight size={11} />
            </span>
          </div>
        </div>
      </div>

      {/* Unread indicator dot */}
      {isUnread && <span className="stitch-noti-card__unreadDot" />}
    </div>
  );
};

export default Notification;