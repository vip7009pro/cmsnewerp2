import React from "react";
import {
  AiOutlineFullscreen,
  AiOutlineFullscreenExit,
  AiOutlineReload,
} from "react-icons/ai";

interface HeaderProps {
  isLoading: boolean;
  isFullscreen: boolean;
  onRefresh: () => void;
  onToggleFullscreen: () => void;
}

export const PrecisionAUDITHistoryHeader: React.FC<HeaderProps> = ({
  isLoading,
  isFullscreen,
  onRefresh,
  onToggleFullscreen,
}) => {
  return (
    <div className="pah-header">
      <div className="header-left">
        <div className="title-group">
          <span className="brand-badge">CMS ERP</span>
          <span className="compliance-badge">ISO 9001 / IATF 16949</span>
          <h2 className="main-title">
            QUẢN LÝ LỊCH SỬ AUDIT KHÁCH HÀNG & NHÀ CUNG CẤP
          </h2>
        </div>
        <div className="telemetry-tag">
          <span className="pulse-dot" />
          <span>LIVE • AUDIT HISTORY INTEL</span>
        </div>
      </div>

      <div className="header-actions">
        <button
          className="btn-header-action"
          onClick={onRefresh}
          disabled={isLoading}
          title="Tải lại dữ liệu"
        >
          <AiOutlineReload className={isLoading ? "animate-spin" : ""} />
          <span>{isLoading ? "Đang tải..." : "Làm mới"}</span>
        </button>

        <button
          className="btn-header-action"
          onClick={onToggleFullscreen}
          title={isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}
        >
          {isFullscreen ? (
            <>
              <AiOutlineFullscreenExit />
              <span>Thu nhỏ</span>
            </>
          ) : (
            <>
              <AiOutlineFullscreen />
              <span>Toàn màn hình</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
