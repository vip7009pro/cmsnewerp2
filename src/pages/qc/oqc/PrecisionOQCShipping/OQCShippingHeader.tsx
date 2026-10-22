import React from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";

interface OQCShippingHeaderProps {
  onRefresh: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const OQCShippingHeader: React.FC<OQCShippingHeaderProps> = ({
  onRefresh,
  isFullscreen,
  onToggleFullscreen,
}) => {
  return (
    <div className="precision-oqc-shipping-header">
      <div className="header-left">
        <div className="breadcrumb-item">
          <span className="brand-badge">CMS ERP</span>
          <span className="section-tag">04. QC • OQC /</span>
          <span>QUẢN LÝ XUẤT HÀNG (OQC SHIPPING MANAGEMENT)</span>
        </div>
      </div>

      <div className="header-right">
        <div className="telemetry-status">
          <span className="pulse-dot" />
          <span>SYSTEM ONLINE</span>
        </div>

        <button
          className="btn-header-action"
          onClick={onRefresh}
          title="Làm mới dữ liệu xuất hàng"
        >
          <RefreshIcon style={{ fontSize: "0.85rem" }} />
          <span>Làm Mới</span>
        </button>

        <button
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

export default React.memo(OQCShippingHeader);
