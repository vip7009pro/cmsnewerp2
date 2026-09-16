import React from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";

interface PrecisionCSDataHeaderProps {
  onRefresh: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const PrecisionCSDataHeader: React.FC<PrecisionCSDataHeaderProps> = ({
  onRefresh,
  isFullscreen,
  onToggleFullscreen,
}) => {
  return (
    <div className="precision-cs__header">
      <div className="header-left">
        <span className="brand-badge">CMS ERP</span>
        <span className="section-tag">04. QC • CS /</span>
        <span className="title-text">
          THEO DÕI & XỬ LÝ SỰ CỐ KHÁCH HÀNG (CUSTOMER QUALITY DATA)
        </span>
      </div>

      <div className="header-right">
        <div className="telemetry-status">
          <span className="pulse-dot" />
          <span>LIVE • CS INTEL</span>
        </div>

        <button
          type="button"
          className="btn-header-action"
          onClick={onRefresh}
          title="Làm mới và nạp lại dữ liệu CS"
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

export default React.memo(PrecisionCSDataHeader);
