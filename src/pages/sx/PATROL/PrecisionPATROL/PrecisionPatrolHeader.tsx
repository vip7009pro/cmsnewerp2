import React from "react";
import {
  AiOutlineReload,
  AiOutlineFullscreen,
  AiOutlineFullscreenExit,
  AiOutlinePauseCircle,
  AiOutlinePlayCircle,
} from "react-icons/ai";
import { FiTv, FiActivity } from "react-icons/fi";

interface PrecisionPatrolHeaderProps {
  isLive: boolean;
  fromDate: string;
  setFromDate: (val: string) => void;
  toDate: string;
  setToDate: (val: string) => void;
  isFullScreen: boolean;
  onToggleFullScreen: () => void;
  autoRefresh: boolean;
  onToggleAutoRefresh: () => void;
  countdown: number;
  onReload: () => void;
  onToggleLive: () => void;
}

export const PrecisionPatrolHeader: React.FC<PrecisionPatrolHeaderProps> = ({
  isLive,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  isFullScreen,
  onToggleFullScreen,
  autoRefresh,
  onToggleAutoRefresh,
  countdown,
  onReload,
  onToggleLive,
}) => {
  return (
    <header className="precision-patrol-header">
      <div className="precision-patrol-header__left">
        <span className="brand-badge">CMS ERP</span>
        <div className={`live-badge ${isLive ? "active" : "history"}`}>
          <span className="pulse-dot" />
          <span>{isLive ? "LIVE STREAM" : "LỊCH SỬ"}</span>
        </div>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-title">
          03. SẢN XUẤT • PATROL / GIÁM SÁT CHẤT LƯỢNG TRỰC TIẾP
        </span>
      </div>

      <div className="precision-patrol-header__right">
        {/* Countdown chip auto-refresh */}
        <div className="countdown-chip" title="Chu kỳ tự động làm mới">
          <FiActivity size={12} />
          <span>{autoRefresh ? `${countdown}s` : "PAUSED"}</span>
        </div>

        {/* Nút tạm dừng / tiếp tục auto-refresh */}
        <button
          type="button"
          className="btn-action"
          onClick={onToggleAutoRefresh}
          title={autoRefresh ? "Tạm dừng tự động làm mới" : "Tiếp tục tự động làm mới"}
        >
          {autoRefresh ? <AiOutlinePauseCircle size={14} /> : <AiOutlinePlayCircle size={14} />}
        </button>

        {/* Nút bật tắt Live */}
        <button
          type="button"
          className={`btn-live ${isLive ? "active" : ""}`}
          onClick={onToggleLive}
          title="Chuyển đổi giữa chế độ Live Stream (Hôm nay) và Tra cứu ngày"
        >
          {isLive ? "✓ Chế độ Live" : "Xem Lịch Sử"}
        </button>

        {/* Date picker */}
        <div className="dates-group">
          <input
            type="date"
            className="date-input"
            value={fromDate}
            disabled={isLive}
            onChange={(e) => setFromDate(e.target.value)}
            title="Từ ngày"
          />
          <input
            type="date"
            className="date-input"
            value={toDate}
            disabled={isLive}
            onChange={(e) => setToDate(e.target.value)}
            title="Đến ngày"
          />
        </div>

        {/* Nút reload */}
        <button
          type="button"
          className="btn-action"
          onClick={onReload}
          title="Tải lại toàn bộ dữ liệu"
        >
          <AiOutlineReload size={13} />
        </button>

        {/* Nút TV Fullscreen */}
        <button
          type="button"
          className="btn-fullscreen"
          onClick={onToggleFullScreen}
          title="Bật/tắt chế độ toàn màn hình TV trình chiếu"
        >
          <FiTv size={12} />
          <span>{isFullScreen ? "Thu Nhỏ" : "Trình Chiếu TV"}</span>
        </button>
      </div>
    </header>
  );
};

export default React.memo(PrecisionPatrolHeader);
