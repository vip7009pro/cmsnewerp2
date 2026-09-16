import React from "react";

interface PrecisionAUDITHeaderProps {
  onRefresh: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  isBatchPanelOpen: boolean;
  onToggleBatchPanel: () => void;
}

const PrecisionAUDITHeader: React.FC<PrecisionAUDITHeaderProps> = ({
  onRefresh,
  isFullscreen,
  onToggleFullscreen,
  isBatchPanelOpen,
  onToggleBatchPanel,
}) => {
  return (
    <div className="precision-audit__header">
      <div className="precision-audit__headerLeft">
        <div className="precision-audit__breadcrumbs">
          <span className="code-prefix">04. QC • ISO</span>
          <span className="divider">/</span>
          <span className="title">QUẢN LÝ CHECKSHEET AUDIT (SELF AUDIT & CUSTOMER AUDIT)</span>
        </div>
        <div className="precision-audit__badges">
          <span className="precision-audit__badge precision-audit__badge--blue">CMS ERP</span>
          <span className="precision-audit__badge precision-audit__badge--emerald">ISO COMPLIANCE</span>
        </div>
      </div>

      <div className="precision-audit__headerRight">
        <div className="precision-audit__telemetry">
          <span className="pulse-dot" />
          <span>LIVE • AUDIT INTEL</span>
        </div>

        <button
          type="button"
          className={`precision-audit__headerBtn ${isBatchPanelOpen ? "active" : ""}`}
          onClick={onToggleBatchPanel}
          title={isBatchPanelOpen ? "Ẩn danh sách đợt Audit" : "Hiện danh sách đợt Audit"}
        >
          <span className="material-symbols-outlined">
            {isBatchPanelOpen ? "left_panel_close" : "left_panel_open"}
          </span>
          <span>{isBatchPanelOpen ? "Thu Gọn Đợt" : "Mở Danh Sách Đợt"}</span>
        </button>

        <button
          type="button"
          className="precision-audit__headerBtn"
          onClick={onRefresh}
          title="Tải lại dữ liệu checksheet và danh sách audit"
        >
          <span className="material-symbols-outlined">refresh</span>
          <span>Làm Mới</span>
        </button>

        <button
          type="button"
          className="precision-audit__headerBtn"
          onClick={onToggleFullscreen}
          title={isFullscreen ? "Thoát chế độ toàn màn hình" : "Bật chế độ toàn màn hình"}
        >
          <span className="material-symbols-outlined">
            {isFullscreen ? "fullscreen_exit" : "fullscreen"}
          </span>
          <span>{isFullscreen ? "Thu Gọn" : "Toàn Màn Hình"}</span>
        </button>
      </div>
    </div>
  );
};

export default React.memo(PrecisionAUDITHeader);
