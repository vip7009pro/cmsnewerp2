import React from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { Tooltip } from "@mui/material";

interface Props {
  onReload: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  loading: boolean;
}

export const PrecisionOQCReportHeader: React.FC<Props> = ({
  onReload,
  isFullscreen,
  onToggleFullscreen,
  loading,
}) => {
  return (
    <header className="poqc-header">
      <div className="poqc-header__left">
        <span className="poqc-header__badge-erp">CMS ERP</span>
        <span className="poqc-header__badge-module">OQC INTELLIGENCE</span>
        <h1 className="poqc-header__breadcrumb-title">
          04. QC • OQC / BÁO CÁO TOÀN DIỆN CHỈ SỐ CHẤT LƯỢNG (OQC QUALITY ANALYTICS)
        </h1>
      </div>

      <div className="poqc-header__right">
        {/* Live Quality Telemetry Status */}
        <div className="poqc-header__status-pill">
          <span className="poqc-header__pulse-dot" />
          <AssessmentIcon style={{ fontSize: 13 }} />
          <span>LIVE • OQC INTEL</span>
        </div>

        {/* Reload button */}
        <Tooltip title="Nạp lại toàn bộ dữ liệu báo cáo">
          <button
            type="button"
            className="poqc-header__btn-action"
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
            className="poqc-header__btn-action"
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
