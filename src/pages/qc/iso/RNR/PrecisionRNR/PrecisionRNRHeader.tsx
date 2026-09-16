import React from "react";

interface PrecisionRNRHeaderProps {
  onRefresh: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

const PrecisionRNRHeader: React.FC<PrecisionRNRHeaderProps> = ({
  onRefresh,
  isFullscreen,
  onToggleFullscreen,
}) => {
  return (
    <div className="precision-rnr__header">
      <div className="precision-rnr__headerLeft">
        <div className="precision-rnr__breadcrumbs">
          <span className="code-prefix">04. QC • ISO</span>
          <span className="divider">/</span>
          <span className="title">QUẢN LÝ ĐIỂM THI & GAUGE R&R (MEASUREMENT SYSTEMS ANALYSIS)</span>
        </div>
        <div className="precision-rnr__badges">
          <span className="precision-rnr__badge precision-rnr__badge--blue">CMS ERP</span>
          <span className="precision-rnr__badge precision-rnr__badge--purple">RNR INTELLIGENCE</span>
        </div>
      </div>

      <div className="precision-rnr__headerRight">
        <div className="precision-rnr__telemetry">
          <span className="pulse-dot" />
          <span>LIVE • MSA INTEL</span>
        </div>

        <button
          type="button"
          className="precision-rnr__headerBtn"
          onClick={onRefresh}
          title="Tải lại dữ liệu bài thi"
        >
          <span className="material-symbols-outlined">refresh</span>
          <span>Làm Mới</span>
        </button>

        <button
          type="button"
          className="precision-rnr__headerBtn"
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

export default React.memo(PrecisionRNRHeader);
