import React from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import BiotechIcon from "@mui/icons-material/Biotech";
import { Tooltip } from "@mui/material";

interface Props {
  onReload: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  loading: boolean;
}

export const PrecisionInspectReportHeader: React.FC<Props> = ({
  onReload,
  isFullscreen,
  onToggleFullscreen,
  loading,
}) => {
  return (
    <header className="pir-header">
      <div className="pir-header__left">
        <span className="pir-header__badge-erp">CMS ERP</span>
        <span className="pir-header__badge-module">INSPECTION INTELLIGENCE</span>
        <h1 className="pir-header__breadcrumb-title">
          04. QC • INSPECTION / BÁO CÁO TOÀN DIỆN CHẤT LƯỢNG KIỂM TRA (INSPECTION QUALITY ANALYTICS)
        </h1>
      </div>

      <div className="pir-header__right">
        {/* Live Telemetry Status */}
        <div className="pir-header__status-pill">
          <span className="pir-header__pulse-dot" />
          <BiotechIcon style={{ fontSize: 13 }} />
          <span>LIVE • INSPECT INTEL</span>
        </div>

        {/* Reload button */}
        <Tooltip title="Nạp lại toàn bộ dữ liệu báo cáo">
          <button
            type="button"
            className="pir-header__btn-action"
            onClick={onReload}
            disabled={loading}
          >
            <RefreshIcon style={{ fontSize: 14 }} className={loading ? "animate-spin" : ""} />
            <span>{loading ? "Đang tải..." : "Làm mới"}</span>
          </button>
        </Tooltip>

        {/* Fullscreen toggle */}
        <Tooltip title={isFullscreen ? "Thu nhỏ màn hình" : "Bật toàn màn hình"}>
          <button
            type="button"
            className="pir-header__btn-action"
            onClick={onToggleFullscreen}
          >
            {isFullscreen ? (
              <>
                <FullscreenExitIcon style={{ fontSize: 15 }} />
                <span>Thu nhỏ</span>
              </>
            ) : (
              <>
                <FullscreenIcon style={{ fontSize: 15 }} />
                <span>Toàn màn hình</span>
              </>
            )}
          </button>
        </Tooltip>
      </div>
    </header>
  );
};
