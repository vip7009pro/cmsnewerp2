import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";

interface PrecisionQLGNHeaderProps {
  onRefresh: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  loading: boolean;
}

export const PrecisionQLGNHeader: React.FC<PrecisionQLGNHeaderProps> = ({
  onRefresh,
  isFullscreen,
  onToggleFullscreen,
  loading,
}) => {
  return (
    <div className="precision-qlgn-header">
      <div className="header-left">
        <div className="breadcrumb-item">
          <span className="brand-badge">CMS ERP</span>
          <span className="section-tag">02. R&D • GIAO NHẬN</span>
          <span>/</span>
          <span>QUẢN LÝ GIAO NHẬN DAO - FILM - TÀI LIỆU</span>
        </div>
      </div>
      <div className="header-right">
        <div className="telemetry-status">
          <span className="pulse-dot" />
          <span>LIVE • R&D SYSTEM</span>
        </div>
        <button
          className="btn-header-action"
          onClick={onRefresh}
          disabled={loading}
          title="Làm mới dữ liệu từ CSDL"
        >
          <RefreshIcon style={{ fontSize: "0.95rem" }} className={loading ? "animate-spin" : ""} />
          <span>{loading ? "Đang nạp..." : "Làm Mới"}</span>
        </button>
        <button
          className="btn-header-action"
          onClick={onToggleFullscreen}
          title={isFullscreen ? "Thoát toàn màn hình" : "Chế độ toàn màn hình"}
        >
          {isFullscreen ? (
            <FullscreenExitIcon style={{ fontSize: "1rem" }} />
          ) : (
            <FullscreenIcon style={{ fontSize: "1rem" }} />
          )}
          <span>{isFullscreen ? "Thu Nhỏ" : "Toàn Màn Hình"}</span>
        </button>
      </div>
    </div>
  );
};

export default React.memo(PrecisionQLGNHeader);
