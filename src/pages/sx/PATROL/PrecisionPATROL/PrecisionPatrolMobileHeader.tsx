import React from "react";
import { AiOutlineReload, AiOutlinePauseCircle, AiOutlinePlayCircle } from "react-icons/ai";
import { FiSliders, FiBarChart2 } from "react-icons/fi";

interface PrecisionPatrolMobileHeaderProps {
  isLive: boolean;
  countdown: number;
  autoRefresh: boolean;
  onToggleAutoRefresh: () => void;
  totalIncidents: number;
  showKpi: boolean;
  onToggleKpi: () => void;
  onOpenFilterDrawer: () => void;
  onReload: () => void;
  onToggleLive: () => void;
}

export const PrecisionPatrolMobileHeader: React.FC<PrecisionPatrolMobileHeaderProps> = ({
  isLive,
  countdown,
  autoRefresh,
  onToggleAutoRefresh,
  totalIncidents,
  showKpi,
  onToggleKpi,
  onOpenFilterDrawer,
  onReload,
  onToggleLive,
}) => {
  return (
    <div className="precision-patrol-mobile-header">
      <div className="header-top-row">
        {/* Brand & Trạng thái Live */}
        <div className="header-left">
          <span className="mobile-brand">SX • PATROL</span>
          <button
            type="button"
            className={`live-indicator-chip ${isLive ? "live" : "history"}`}
            onClick={onToggleLive}
            title={isLive ? "Đang xem dữ liệu Live (Hôm nay) - Bấm để chuyển lịch sử" : "Đang xem Lịch Sử - Bấm để bật Live"}
          >
            <span className={`pulse-dot ${isLive ? "live" : ""}`} />
            <span>{isLive ? "LIVE" : "LỊCH SỬ"}</span>
          </button>
        </div>

        {/* Telemetry info chips */}
        <div className="header-center">
          <div className="incident-badge" title="Tổng số sự cố chất lượng">
            <span>⚡ {totalIncidents}</span>
          </div>
          <div
            className="countdown-badge"
            onClick={onToggleAutoRefresh}
            title={autoRefresh ? `Tự động làm mới sau ${countdown}s (Chạm để dừng)` : "Đã tạm dừng tự động làm mới (Chạm để bật)"}
          >
            {autoRefresh ? (
              <>
                <span className="countdown-time">{countdown}s</span>
                <AiOutlinePauseCircle size={13} />
              </>
            ) : (
              <>
                <span className="paused-text">PAUSE</span>
                <AiOutlinePlayCircle size={13} />
              </>
            )}
          </div>
        </div>

        {/* Action icons */}
        <div className="header-right">
          <button
            type="button"
            className={`btn-icon-control ${showKpi ? "active" : ""}`}
            onClick={onToggleKpi}
            title="Bật/Tắt dải chỉ số KPI nhanh"
          >
            <FiBarChart2 size={15} />
            <span>KPI</span>
          </button>

          <button
            type="button"
            className="btn-icon-control"
            onClick={onOpenFilterDrawer}
            title="Mở bộ lọc ngày & phân hệ"
          >
            <FiSliders size={15} />
          </button>

          <button
            type="button"
            className="btn-icon-control btn-reload"
            onClick={onReload}
            title="Làm mới dữ liệu tức thì"
          >
            <AiOutlineReload size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionPatrolMobileHeader);
