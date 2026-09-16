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

export const PrecisionAllDocHeader: React.FC<HeaderProps> = ({
  isLoading,
  isFullscreen,
  onRefresh,
  onToggleFullscreen,
}) => {
  return (
    <div className="pad-header">
      <div className="header-left">
        <div className="title-group">
          <span className="brand-badge">CMS ERP</span>
          <span className="compliance-badge">ISO 9001 / IATF 16949</span>
          <h2 className="main-title">
            QUẢN LÝ TÀI LIỆU, TIÊU CHUẨN & HỒ SƠ CHẤT LƯỢNG
          </h2>
        </div>
        <div className="telemetry-tag">
          <span className="pulse-dot" />
          <span>LIVE • DOC INTEL</span>
        </div>
      </div>

      <div className="header-actions">
        <button
          className="btn-header-action"
          onClick={onRefresh}
          disabled={isLoading}
          title="Tải lại danh sách tài liệu"
        >
          <AiOutlineReload className={isLoading ? "animate-spin" : ""} />
          <span>{isLoading ? "Đang nạp..." : "Làm mới"}</span>
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
