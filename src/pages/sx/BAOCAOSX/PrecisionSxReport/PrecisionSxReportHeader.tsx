import React from "react";
import { FiActivity, FiRefreshCw, FiChevronRight } from "react-icons/fi";

interface PrecisionSxReportHeaderProps {
  onReload: () => void;
}

const PrecisionSxReportHeader: React.FC<PrecisionSxReportHeaderProps> = ({ onReload }) => {
  return (
    <div className="precision-sx-header">
      <div className="precision-sx-header__left">
        <span className="precision-sx-header__badge-brand">CMS QLSX</span>
        <div className="precision-sx-header__breadcrumb">
          <span>Sản Xuất</span>
          <FiChevronRight size={12} />
          <span className="active">Production Performance Executive Dashboard</span>
        </div>
        <div className="precision-sx-header__telemetry">
          <span className="pulse-dot" />
          <span>Realtime Performance Analytics</span>
        </div>
      </div>

      <div className="precision-sx-header__right">
        <button
          type="button"
          className="precision-sx-header__btn-action"
          onClick={onReload}
          title="Tải lại toàn bộ dữ liệu báo cáo"
        >
          <FiRefreshCw size={12} />
          <span>Đồng Bộ Dữ Liệu</span>
        </button>
      </div>
    </div>
  );
};

export { PrecisionSxReportHeader };
export default React.memo(PrecisionSxReportHeader);
