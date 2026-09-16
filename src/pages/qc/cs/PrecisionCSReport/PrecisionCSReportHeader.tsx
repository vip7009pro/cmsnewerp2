import React from "react";
import { FiRefreshCw, FiMaximize, FiMinimize } from "react-icons/fi";

interface Props {
  onReload: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  loading?: boolean;
}

export const PrecisionCSReportHeader: React.FC<Props> = ({
  onReload,
  isFullscreen,
  onToggleFullscreen,
  loading = false,
}) => {
  return (
    <div className="pcs-header">
      <div className="pcs-header__left">
        <span className="pcs-header__badge-erp">CMS ERP</span>
        <span className="pcs-header__badge-module">CS INTELLIGENCE</span>
        <h1 className="pcs-header__breadcrumb-title">
          04. QC • CS / BÁO CÁO DỊCH VỤ KHÁCH HÀNG & SỰ CỐ CHẤT LƯỢNG (CS QUALITY & ISSUE ANALYTICS)
        </h1>
      </div>

      <div className="pcs-header__right">
        <div className="pcs-header__status-pill">
          <span className="pcs-header__pulse-dot" />
          <span>LIVE • CS INTEL</span>
        </div>

        <button
          type="button"
          className="pcs-header__btn-action"
          onClick={onReload}
          disabled={loading}
          title="Tải lại toàn bộ dữ liệu báo cáo"
        >
          <FiRefreshCw className={loading ? "animate-spin" : ""} size={12} />
          <span>{loading ? "Đang Tải..." : "Làm Mới"}</span>
        </button>

        <button
          type="button"
          className="pcs-header__btn-action"
          onClick={onToggleFullscreen}
          title={isFullscreen ? "Thu nhỏ cửa sổ" : "Phóng to toàn màn hình"}
        >
          {isFullscreen ? <FiMinimize size={12} /> : <FiMaximize size={12} />}
          <span>{isFullscreen ? "Thu Nhỏ" : "Toàn Màn Hình"}</span>
        </button>
      </div>
    </div>
  );
};

export default React.memo(PrecisionCSReportHeader);
