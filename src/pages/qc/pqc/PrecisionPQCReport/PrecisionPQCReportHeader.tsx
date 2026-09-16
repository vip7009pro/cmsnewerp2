import React from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";

interface PrecisionPQCReportHeaderProps {
  onReload: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  loading: boolean;
}

export const PrecisionPQCReportHeader: React.FC<PrecisionPQCReportHeaderProps> = ({
  onReload,
  isFullscreen,
  onToggleFullscreen,
  loading,
}) => {
  return (
    <div className="precision-pqc-header">
      <div className="header-left">
        <div className="breadcrumb-item">
          <span className="brand-badge">CMS ERP</span>
          <span className="section-tag">04. QC • PQC</span>
          <span>/</span>
          <span>BÁO CÁO TOÀN DIỆN CHỈ SỐ CHẤT LƯỢNG & XU HƯỚNG LỖI (PQC ANALYTICS)</span>
        </div>
      </div>
      <div className="header-right">
        <div className="telemetry-status">
          <span className="pulse-dot" />
          <span>LIVE • QUALITY INTEL</span>
        </div>
        <button
          className="btn-header-action"
          onClick={onReload}
          disabled={loading}
          title="Tải lại toàn bộ dữ liệu báo cáo từ máy chủ"
        >
          <RefreshIcon style={{ fontSize: "0.95rem" }} className={loading ? "animate-spin" : ""} />
          <span>{loading ? "Đang nạp..." : "Làm Mới"}</span>
        </button>
        <button
          className="btn-header-action"
          onClick={onToggleFullscreen}
          title={isFullscreen ? "Thu nhỏ về giao diện thường" : "Chế độ xem toàn màn hình"}
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

export default React.memo(PrecisionPQCReportHeader);
