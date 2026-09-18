import React from "react";
import { FiActivity, FiRefreshCw } from "react-icons/fi";

interface PrecisionKpiNvSxHeaderProps {
  totalRecords: number;
  uniqueEmpl: number;
  option: string;
  isLoading: boolean;
  onReload: () => void;
}

const PrecisionKpiNvSxHeader: React.FC<PrecisionKpiNvSxHeaderProps> = ({
  totalRecords,
  uniqueEmpl,
  option,
  isLoading,
  onReload,
}) => {
  return (
    <div className="precision-kpinvsx__header">
      <div className="precision-kpinvsx__headerLeft">
        <div className="precision-kpinvsx__badge">
          <FiActivity size={13} />
          <span>SX PRECISION • KPI NV</span>
        </div>
        <div className="precision-kpinvsx__titleWrap">
          <h1 className="precision-kpinvsx__title">
            Báo Cáo Hiệu Suất & Đánh Giá KPI Nhân Viên Sản Xuất
          </h1>
          <div className="precision-kpinvsx__breadcrumb">
            <span>Sản Xuất</span>
            <span className="separator">/</span>
            <span>Hiệu Suất & Năng Suất</span>
            <span className="separator">/</span>
            <span className="current">KPI Nhân Viên ({option})</span>
          </div>
        </div>
      </div>

      <div className="precision-kpinvsx__headerRight">
        <div className="precision-kpinvsx__telemetry">
          <div className="telemetry-pill">
            <span className="label">Nhân Sự:</span>
            <strong className="value">{uniqueEmpl}</strong>
          </div>
          <div className="telemetry-pill">
            <span className="label">Bản Ghi:</span>
            <strong className="value">{totalRecords.toLocaleString("en-US")}</strong>
          </div>
        </div>

        <button
          type="button"
          className={`precision-kpinvsx__btnReload ${isLoading ? "is-loading" : ""}`}
          onClick={onReload}
          title="Tải lại dữ liệu KPI"
          disabled={isLoading}
        >
          <FiRefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
          <span>{isLoading ? "Đang Tải..." : "Làm Mới"}</span>
        </button>
      </div>
    </div>
  );
};

export { PrecisionKpiNvSxHeader };
export default React.memo(PrecisionKpiNvSxHeader);
