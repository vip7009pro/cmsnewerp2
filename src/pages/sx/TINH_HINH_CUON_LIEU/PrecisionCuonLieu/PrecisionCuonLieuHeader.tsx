import React from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";

interface PrecisionCuonLieuHeaderProps {
  onRefresh: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const PrecisionCuonLieuHeader: React.FC<PrecisionCuonLieuHeaderProps> = ({
  onRefresh,
  isFullscreen,
  onToggleFullscreen,
}) => {
  return (
    <div className="precision-cuonlieu__header">
      <div className="header-left">
        <span className="brand-badge">CMS ERP</span>
        <span className="section-tag">03. SẢN XUẤT • THEO DÕI CUỘN LIỆU /</span>
        <span className="title-text">
          MATERIAL LOT STATUS & ROLL LOSS (TÌNH HÌNH CUỘN LIỆU)
        </span>
      </div>

      <div className="header-right">
        <div className="telemetry-status">
          <span className="pulse-dot" />
          <span>LIVE • MATERIAL INTEL</span>
        </div>

        <button
          type="button"
          className="btn-header-action"
          onClick={onRefresh}
          title="Làm mới và nạp lại dữ liệu cuộn liệu"
        >
          <RefreshIcon style={{ fontSize: "0.85rem" }} />
          <span>Làm Mới</span>
        </button>

        <button
          type="button"
          className="btn-header-action"
          onClick={onToggleFullscreen}
          title={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
        >
          {isFullscreen ? (
            <FullscreenExitIcon style={{ fontSize: "0.85rem" }} />
          ) : (
            <FullscreenIcon style={{ fontSize: "0.85rem" }} />
          )}
          <span>{isFullscreen ? "Thu Nhỏ" : "Toàn Màn Hình"}</span>
        </button>
      </div>
    </div>
  );
};

export default React.memo(PrecisionCuonLieuHeader);
