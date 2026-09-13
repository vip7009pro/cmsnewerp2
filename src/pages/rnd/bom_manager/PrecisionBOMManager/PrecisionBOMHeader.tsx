import React from "react";
import { AiOutlineFullscreen, AiOutlineReload } from "react-icons/ai";
import { BiLayer } from "react-icons/bi";
import { MdDesignServices } from "react-icons/md";

interface PrecisionBOMHeaderProps {
  serverTime: string;
  onReload: () => void;
  onToggleDesignBom: () => void;
  showDesignBom: boolean;
}

const PrecisionBOMHeader: React.FC<PrecisionBOMHeaderProps> = ({
  serverTime,
  onReload,
  onToggleDesignBom,
  showDesignBom,
}) => {
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="precision-bom__header">
      <div className="header-breadcrumb">
        <span className="badge-tag">BOM MASTER</span>
        <span className="separator">/</span>
        <span className="text-muted">R&D Nghiên Cứu</span>
        <span className="separator">/</span>
        <span className="text-muted">QLSX</span>
        <span className="separator">/</span>
        <span className="text-active">Định Mức & Cấu Trúc Sản Phẩm (BOM Manager)</span>
        <span className="status-pill">LIVE SYNC</span>
      </div>

      <div className="header-actions">
        <div className="telemetry-time" title="Đồng hồ realtime máy chủ">
          {serverTime || "2026-09-13 16:00:00"}
        </div>
        <button
          className="btn-header btn-header--design"
          onClick={onToggleDesignBom}
          title="Bật/Tắt công cụ Thiết kế BOM Nhanh"
        >
          <MdDesignServices size={14} />
          <span>{showDesignBom ? "Đóng Design BOM" : "BOM DESIGN"}</span>
        </button>
        <button
          className="btn-header btn-header--reload"
          onClick={onReload}
          title="Làm mới toàn bộ danh mục mã"
        >
          <AiOutlineReload size={13} />
          <span>Làm mới</span>
        </button>
        <button
          className="btn-header btn-header--reload"
          onClick={toggleFullScreen}
          title="Toàn màn hình"
        >
          <AiOutlineFullscreen size={14} />
        </button>
      </div>
    </div>
  );
};

export default React.memo(PrecisionBOMHeader);
